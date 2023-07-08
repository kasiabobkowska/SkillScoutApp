// ClientApi2 / Client / ClientApp / src / components / Save.js


import React, { Component } from 'react'; //z biblioteki react
import { CSVLink } from 'react-csv'; // do generowania csv
import { Button } from 'reactstrap';
import axios from 'axios'; //  do wykonywania żądań HTTP do API


// rozszerzebue jkasy komponent -> konstruktor, który 
// incijalizuje komponent state- początkowo pusta tablica contacts
export class Save extends Component {
    //props jest odpowiedzialny za inicjalizowanie obiektu przy jego stworzeniu
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
        };
    }
    //automatyczna metoda - gdy wysyła żądanie do punktu końćowego API do pobrania informacji i zapisania go w tablicy contacts
    //pobierania danych kontaktowych z API i aktualizaowanie tablicy z danymi - CAŁOŚĆ TABLICY

    componentDidMount() {
        this.fetchContacts();
    }

    fetchContacts() {
        // używamy axios do wysłania żądania HTTP GET do punktu końcowego API (api/people/)
        axios
            .get('https://localhost:44302/api/people')
            .then(response => {
                this.setState({ contacts: response.data });
                //jeśli żądanie jest udane to odpowiedź jest przechowywana w komponencie - inaczej wyskakuje błąd
            })
            .catch(error => {
                console.log(error);
            });
    }

    // stan do komponentu do wygenerowania csv
    render() {
        const { contacts } = this.state;
        // zmienna z danymi do csv - zmapowanie tablicy contacts 
        // przekształcone z odpowiednimi kluczami i wartościami z obiektów
        const csvData = contacts.map(contact => ({
            "First Name": contact.name,
            "Last Name": contact.surname,
            "Phone Number": contact.phone,
            Email: contact.email, 
        }));

        // zdefiniowanie nagłówków
        const headers = [
            { label: "First Name", key: "First Name" },
            { label: "Last Name", key: "Last Name" },
            { label: "Phone Number", key: "Phone Number" },
            { label: "Email", key: "Email" }, 
        ];
        // zwraca button do pobrania csv - z biblioteki reactstrap
        // komponet CSVLink generuje link do pobrania csv - csvData i nagłówki z headers
        return (
            <div>
                <Button color="black">
                    <CSVLink data={csvData} headers={headers}>
                        Download CSV
                    </CSVLink>
                </Button>
            </div>
        );
    }
}







// NASVMENU - nawigacja
// ClientApi2 / Client / ClientApp / src / components / NavMenu.js

import React, { Component } from 'react';
// gotowe komponenty z reacta do nawigacji i paska nawigacji
import { Collapse, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// do nawigacji między ścieżkami
import { Link } from 'react-router-dom';
// arkusz stylów dla komponentu
import './NavMenu.css';\
//obrazek z logo
import logoImage from './logo.png'; // Importuj obrazek



// klasa NavMenu - rozszerza klasę Component (z reacta)
export class NavMenu extends Component {
    //ustawia nazwę dla komponentu
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        //zmienia stan collapsed po wyyołaniu metody
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }


    // renderuje interfejs użytkownika dla komponentu - pasekavigacji
    render() {
        return (
            <header>
                {/* definiuje jak bardzo pasek może być rozwinięty dla ekranów małych lub większych */}
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    {/*  a na małych ekranach ma się zwijać */}
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">

                            {/* elementy paska nawigacji */}
                            {/* navitem to pojedynczy element nawigacji w pasku - każdy zawiera navlink
                            czyli nawigację do określonej ścieżki w aplikacji */}
                            <NavItem>
                                
                                <NavLink tag={Link} className="text-dark" to="/">
                                    {/* link routera do ścieżki
                                     */}
                                    <img src={logoImage} alt="Phone" className="logo-image" /> {/* Wyœwietl obrazek */}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark nav-link-margin" to="/">
                                    Phone Book
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark nav-link-margin" to="/save">
                                    Save
                                </NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}