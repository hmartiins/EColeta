import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface IItem{
  id: number;
  title: string;
  imgUrl: string;
};
interface IIbgeUfResponse{
  sigla: string;
}
interface IIbgeCityResponse{
  nome : string;
}
const CreatePoint = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>{
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    api.get('items').then(response =>{
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get<IIbgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
      const ufInitials = response.data.map(uf => uf.sigla);
        
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if(selectedUf === '0') return;

    axios.get<IIbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response =>{
      const cityNames = response.data.map(city => city.nome);
        
      setCities(cityNames);
    });

  }, [selectedUf]);

  function handleSelectUF(e: ChangeEvent<HTMLSelectElement>){
    const uf = e.target.value;

    setSelectedUf(uf);
  }
  function handleSelectCity(e: ChangeEvent<HTMLSelectElement>){
    const city = e.target.value;

    setSelectedCity(city);
  }
  function handleMapClick(e: LeafletMouseEvent){
    setSelectedPosition([
      e.latlng.lat,
      e.latlng.lng
    ]);  
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>){
    const {name, value} = e.target;
    
    setFormData({ ...formData, [name]: value });
  }
  function handleSelectItem(id: number){
    const alredySelected = selectedItems.findIndex(item => item === id);

    if(alredySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);
      
      setSelectedItems(filteredItems);
    } else{
      setSelectedItems([...selectedItems, id]);
    }
  }
  async function handleSubmit(e: FormEvent){
    e.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = { 
      uf, 
      city, 
      latitude,
      longitude,
      items,
      name, 
      email, 
      whatsapp 
     }

     await api.post('points', data);

     alert('Ponto de coleta criado');
     history.push('/');
  }
  return(
    <div id="page-create-point">
      <header> 
        <img src={logo} alt="logo"/>
        <Link to="/">
          <FaArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto <br/>de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade:</label>
            <input onChange={handleInputChange} type="text" name="name" id="name"/>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email:</label>
              <input onChange={handleInputChange} type="email" name="email" id="email"/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <input onChange={handleInputChange} type="text" name="whatsapp" id="whatsapp"/>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>
              Selecione o Endereço no mapa  
            </span>
          </legend>

          <Map onClick={handleMapClick} center={initialPosition} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select value={selectedUf} onChange={ handleSelectUF } name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf =>(
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Selecione uma cidade</label>
              <select value={selectedCity} onChange={handleSelectCity} name="city" id="city">
                <option value="0">Selecione uma cidade</option>
                {cities.map(city =>(
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>
              Selecione um ou mais itens abaixo  
            </span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li
                className={selectedItems.includes(item.id) ? 'selected': ''} 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.imgUrl} alt="logo"/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;