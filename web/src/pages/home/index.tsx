import React from 'react';
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';
import ilustration from '../../assets/home-background.svg';

const Home = () =>{
  return(
    <div className="container">
      <div className="leftContent">
        <div className="content">
          <header>
            <img src={logo} alt="Logo"/>
          </header>
          <main>
           <h1>Seu marketplace de coleta de resíduos.</h1>
           <p>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente</p>
           <Link to="/create-point">
             <span> <FaArrowRight/> </span>
             <strong>Cadastre um ponto de coleta</strong>
           </Link>
         </main>
        </div>
      </div>
      <div className="rightContent">
        <img className="imgContent" src={ilustration} alt="Logo"/>
      </div>
    </div>
  //   <div id="page-home">
  //       <main>
  //         <h1>Seu marketplace de coleta de resíduos.</h1>
  //         <p>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente</p>
  //         <a href="/cadastro">
  //           <span> <FaArrowRight/> </span>
  //           <strong>Cadastre um ponto de coleta</strong>
  //         </a>
  //       </main>
  //     </div>
  //   </div>
  )
}

export default Home;