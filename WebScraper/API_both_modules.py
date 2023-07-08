import requests
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import json
from bs4 import BeautifulSoup
import sys
import sqlite3
import random
from datetime import datetime


class GetJobOffers:
    def __init__(self):
        self.connection = sqlite3.connect(r"C:\Users\Kasiul\Desktop\SkillScoutAPI\Django\skill_scout_app\db.sqlite3")
        self.connection.text_factory = str
        self.cursor = self.connection.cursor()

    def CreateURLfromPosition(self, position):
        template = 'https://www.pracuj.pl/praca/{};kw/warszawa;wp?rd=0&et=17'
        position = position.replace(' ', '%20')
        url = template.format(position)
        return url

    def ConvertToJson(self, dictionaryData, position):
        convertedData = {
            "data": dictionaryData,
            "tag": position
        }
        convertedData = json.dumps(convertedData, ensure_ascii=False).encode('utf-8')
        return convertedData

    def SaveToDatabase(self, convertedData):
        randomNumber = random.randint(1, 1000)
        id = int(datetime.now().microsecond) + randomNumber
        self.connection.execute('insert into offers_joboffer values (?,?)', [id, convertedData])
        self.connection.commit()

    def GetRecordDetails(self, position):
        card = {
            "job_title": '',
            "company": '',
            "job_location": '',
            "additional_info": [],
            "job_url": '',
            "tag": position
        }

        url = self.CreateURLfromPosition(position)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        cards = soup.find_all('div', {'class': 'listing_c1dc6in8'})

        for card_data in cards:
            job_title = card_data.find('h2', {'data-test': 'offer-title'}).text.strip()
            company = card_data.find('h4', {'data-test': 'text-company-name'}).text.strip()
            job_location = card_data.find('h5', {'data-test': 'text-region'}).text.strip()
            job_url = card_data.find('a', {'data-test': 'link-offer'}).get('href')

            additional_info = {}

            for i in range(5):
                additional_info_element = card_data.find('li', {'data-test': f'offer-additional-info-{i}'})
                additional_info_value = additional_info_element.text.strip() if additional_info_element else ''
                additional_info[f"add_info{i}"] = additional_info_value

            card['job_title'] = job_title
            card['company'] = company
            card['job_location'] = job_location
            card['job_url'] = job_url
            card['additional_info'] = additional_info

            converted_data = self.ConvertToJson(card, position)
            self.SaveToDatabase(converted_data)

        return card


class GetCourses:
    def __init__(self):
        self.s = Service('chromedriver.exe')
        self.delay = 30
        self.driver = webdriver.Chrome(service=self.s)
        self.connection = sqlite3.connect(r"C:\Users\Kasiul\Desktop\SkillScoutAPI\Django\skill_scout_app\db.sqlite3")
        self.connection.text_factory = str

    def extract_text(self, soup_obj, tag, attribute_name, attribute_value):
        txt = soup_obj.find(tag, {attribute_name: attribute_value}).text.strip() if soup_obj.find(tag, {
            attribute_name: attribute_value}) else ''
        return txt

    def clean_course_title(self, title):
        title = title.strip()
        if "Skills" in title:
            title = title.split("Skills", 1)[0].strip()
        elif "Skills - Expanded" in title:
            title = title.split("Skills - Expanded", 1)[0].strip()
        return title

    def CreateURLFromSkill(self, skill):
        template = 'https://www.pluralsight.com/browse?=&q={}&type=all&sort=default'
        skill = skill.replace(' ', '%20')
        url = template.format(skill)
        return url

    def ConvertToJson(self, dictionaryData, position):
        convertedData = {
            "data": dictionaryData,
            "tag": position
        }
        convertedData = json.dumps(convertedData, ensure_ascii=False).encode('utf-8')
        return convertedData

    def SaveToDatabase(self, convertedData):
        randomNumber = random.randint(1, 1000)
        id = int(datetime.now().microsecond) + randomNumber
        self.connection.execute('insert into offers_course values (?,?)', [id, convertedData])
        self.connection.commit()

    def GetRecordDetails(self, skill, position):
        card = {
            "course_title": '',
            "course_level": '',
            "course_length": '',
            "course_url": '',
            "tag": position
        }

        url = self.CreateURLFromSkill(skill)
        self.driver.get(url)
        time.sleep(5)

        try:
            WebDriverWait(self.driver, self.delay).until(
                EC.presence_of_element_located((By.CLASS_NAME, "browse-search-results")))
        except TimeoutException:
            print('Loading exceeds delay time')
        else:
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            course_list = soup.find('div', {'class': 'browse-search-results'})
            courses = course_list.find_all('li', {'class': 'browse-search-results-item large-12 columns'})

            for course in courses:
                course_title = course.find('h3').text.strip()
                course_title = self.clean_course_title(course_title)
                course_url = course.a.get('href')
                course_length = course.find('div', class_='duration').text.strip()
                course_level = course.find('div', class_='level').text.strip()

                card['course_title'] = course_title
                card['course_level'] = course_level
                card['course_length'] = course_length
                card['course_url'] = course_url

                converted_data = self.ConvertToJson(card, position)
                self.SaveToDatabase(converted_data)

        return card


position = 'web developer'

job_offers = GetJobOffers()
job_offer_card = job_offers.GetRecordDetails(position)

courses = GetCourses()
course_card = courses.GetRecordDetails('web development', position)
