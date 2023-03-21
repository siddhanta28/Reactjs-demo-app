<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="client/public/wepitcher-logo.png" alt="Logo" width="380" height="80">
  </a>
  <h3 align="center">A Gallery of Pitch Decks</h3>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot][product-screenshot]

This project was built as a demonstration of my fullstack development capabilities. 

Highlighted Features:
* User Login & Registration (Auth) with Passport
* Ability to upload PDF, PPT or PPTX file which gets converted to an array of images.
* A clean UI

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

Here is what I used to build it:

* [Next.js](https://nextjs.org/)
* [React.js](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Node.js](https://nodejs.org/)
* [Tailwindcss](https://tailwindcss.com/)
* [LibreOffice](https://www.libreoffice.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

## Prerequisites
#### Dependencies

Please install **node.js, libreoffice, imagemagick** and might required **ghostscript** for Mac os (Note: Please do restart your machine after installed all required software. You will also need **Docker** for running a local MongoDB instance otherwise you can update the MONGO_DB_CONNECTION_STRING value in .env file in the /api directory to connect to your own mongodb)


### *IMPORTANT*
Make sure you install libreoffice to the USER you launch nodejs with and that this user HAS a home directory!
try to convert a file from inside that USER to properly test!
in case you install directly from libreoffice website,
MAKE SURE you use the ./install script that comes inside the tar.gz inside the USER!

You will need to set the value of "LIBRE_OFFICE_PATH" in the .env file in the API directory to one of the below values depending on your OS and where you have installed LibreOffice. 

#### Windows
 ```sh
C:\\Program Files\\LibreOffice\\program\\soffice.exe (or)
C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe (or)
C:\\Program Files (x86)\\LIBREO~1\\program\\soffice.exe
```
#### Ubuntu
 ```sh
/usr/bin/libreoffice (or)
/usr/bin/soffice
```
#### Mac OS
```sh
/Applications/LibreOffice.app/Contents/MacOS/soffice
```

### Installation

_Follow the below steps to install and setup the app._

1. Clone this repo
   ```sh
   git clone https://github.com/brightidea/wppitcher.git
   ```
2. CD into the project
   ```sh
   cd wepitcher
   ```
3. Start the MongoDB instance using docker-compose
   ```sh
   docker-compose up -d
   ```
4. Copy the example .env files to actual .env in both Client & API Folders
   ```js
   // IN API FOLDER
   cp .env.example .env

    // IN CLIENT FOLDER
   cp .env.example .env.local
   ```
5. CD into the api + npm install + run app
   ```js
   cd api && npm install && npm run dev 
   ```
6. Open a second terminal in root of project then run client app
   ```js
   cd client && npm install && npm run dev 
   ```
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] Add Dockerfile for Client App
- [ ] Add Dockerfile for API App + Running LibreOffice
- [x] Add Dockerfile for MongoDB
- [ ] Create Database Seed Script
- [ ] Deploy demo to netlify or digital ocean
- [ ] Fix userContext hydration when logging out of one account and into another. 


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Blake Moore - [@blakeevanmoore](https://twitter.com/blakeevanmoore) - blake@blakemoore.io

Project Link: [https://github.com/brightidea/wepitcher](https://github.com/brightidea/wepitcher)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

I've included a few of the resources I used when building this project.

* [Mongoose Docs](https://mongoosejs.com/docs/api.html)
* [Tailwindcss Docs](https://tailwindcss.com/docs)
* [Best ReadMe Template](https://github.com/othneildrew/Best-README-Template)
* [File Convert Package](https://github.com/kalimuthu-selvaraj/file-convert)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-url]: https://github.com/brightidea/wepitcher/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/brightidea/wepitcher.svg?style=for-the-badge
[forks-url]: https://github.com/brightidea/wepitcher/network/members
[stars-shield]: https://img.shields.io/github/stars/brightidea/wepitcher.svg?style=for-the-badge
[stars-url]: https://github.com/brightidea/wepitcher/stargazers
[issues-shield]: https://img.shields.io/github/issues/brightidea/wepitcher.svg?style=for-the-badge
[issues-url]: https://github.com/brightidea/wepitcher/issues
[license-shield]: https://img.shields.io/github/license/brightidea/wepitcher.svg?style=for-the-badge
[license-url]: https://github.com/brightidea/wepitcher/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/brightidea
[product-screenshot]: https://sfo2.digitaloceanspaces.com/wpbeastmode/wepitcher.jpg
