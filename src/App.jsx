import { useId, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteOutline } from "react-icons/md";
import {Toaster, toast } from 'sonner'


const styles = {
  fontSize: 10,
  fontFamily: "arial",
  textAlign: "center",
  padding: "50px",
};

const btnStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  borderRadius: "5px",
  outline: "none",
  fontSize: "10px",
};

// Estilo para el título
const titleStyle = {
  fontSize: 20,
  fontStyle: 'normal',
  textColor: 'Black',
};

// Estilo para el subtítulo
const subtitleStyle = {
  fontSize: 25,
  fontStyle: 'normal',
  textColor: 'black',
  fontWeight: '500'
};

// Estilo para el cuerpo del texto
const bodyStyle = {
  fontSize: 12,
  fontStyle: 'normal',
  textColor: 'black'
};

function App() {
  
  const id = uuidv4();

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState('');
  const [userNameCompany, setUserNameCompany] = useState('');
  const [documentCompany,setSetdocument] =useState("")


    const totalReduce = items.reduce((sum,curret) =>{
      return  sum + curret.price * curret.quantity
  },0)
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('es-ES', options);


    const requiredValidator = (value) => {
      // Verificar si el valor está vacío o es null/undefined
      return !(value === '' || value === null || value === undefined);
    };

    const print = () => {
      if(items.length ==0) {
        toast.error('por favor agrega un producto')
      }else{
      const input = document.getElementById("printThis");
     
      const pdf = new jsPDF({
        format: [500, 1100] // Custom size: width = 500, height = 1100 (in units, default is mm)
      });

      pdf.setFont('arial');
      html2canvas(input, {scale:0.1}).then((canvas) => {
        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
        
          format: [800, 800]
      });
      
      pdf.setFont('arial');
      // Título
      pdf.setFontStyle(titleStyle.fontStyle);
      pdf.setFontStyle(btnStyle.fontSize);
      pdf.text(100, 20, `Medellín, ${currentDate}`);
      pdf.setFontStyle(btnStyle.fontSize);
      pdf.text(120, 35, userNameCompany);
      pdf.text(110, 50, `CC: ${documentCompany}`);
      pdf.text(100, 80, `DEBE A:`);
      pdf.text(100, 89, `Edilberto jose boscan alcantara`);
      pdf.text(100, 98, `CC: 1017277279`);

      pdf.text(30, 142, `Concepto`);
      pdf.text(200, 142, `Valor unitario`);
      
      let count  =40
      items.map((item, index) => {
      const total =  parseInt(150 + parseInt(index *8))
      count =total
         pdf.text(30, total,`${item.quantity} ${item.name}`)
        pdf.text(200, total,`${parseInt(item.price).toLocaleString()}`)
      })


      const total = count +30
      const totalFooter = total+10

      pdf.text(30, total, `Valor total  $${parseInt(totalReduce).toLocaleString()}`);
      pdf.text(30, totalFooter, `Favor consignar a mi cuenta de ahorros Bancolombia 34200005004`);
      
      pdf.save("download.pdf"); // Guarda el PDF
      });
    }
    };

    const handleAddToCart = () => {
      if(requiredValidator(name) && requiredValidator(price)&& requiredValidator(quantity) ){
        const cleanedPrice = price.replace(/\./g, '');
        const newItem = {
          id,
          name: name,
          price: cleanedPrice,
          quantity: parseInt(quantity),
          total: 10000 * parseInt(quantity)
        };
  
        setItems([...items, newItem]);
        // Limpiar los campos después de agregar
        setName('');
        setPrice('');
        setQuantity('');
      }else{
        toast.error('por favor completa todos los formularios')
      }
    };

  const numberWithCommas = (value) => {
    // Convertir el valor a un número entero
    const intValue = parseInt(value.replace(/[^\d]/g, ''), 10);
    // Formatear el número con separadores de miles
    const formattedValue = intValue.toLocaleString('es-CO');
    return formattedValue;
  };


  const eliminarProducto = (productoAEliminar) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productoAEliminar));
  };


  console.log(items)

  return (
    <div>
       <Toaster richColors />
     <div className="cart-container">
     <p>Medellín, {currentDate}</p>
     <div className="input-container">
         <label>
          Nombre de la empresa:
          <input type="text" value={userNameCompany} onChange={(e) => setUserNameCompany(e.target.value)} />
        </label>
        <label>
        Nit de la empresa o Documento:
          <input type="number" value={documentCompany} onChange={(e) => setSetdocument(e.target.value)} />
        </label>
      </div>
      <h2>Carrito de Compras</h2>
      <div className="input-container">
        <label>
          Descripcion:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Precio:
          <input
              type="text"
              value={price !== '' ? numberWithCommas(price) : ''}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
            />
        </label>
        <label>
          Cantidad:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <button onClick={handleAddToCart} className='button-add' >Agregar al Carrito</button>
      </div>
      <div className="items-container">
      {items.map((item, index) => (
        <div key={index} className="item">
          <p>Descripción: {item.name}</p>
          <p>Precio: ${parseInt(item.price).toLocaleString()}</p>
          <p>Cantidad: {item.quantity}</p>
          <p>Total: ${parseInt(item.price * item.quantity).toLocaleString()}</p>
          <MdDeleteOutline color='red' fontSize={34} style={{cursor:"pointer"}} onClick={() =>eliminarProducto(item.id)} />

        </div>
      ))}
    </div>

  <button onClick={print} className='button-download-pdf' >descargar pdf </button>
  <div style={{ position: 'absolute', left: 50, top: -500 }}>
                  <div id="printThis">
                  
                  </div>
                </div>
      </div>
      </div>
  )
}

export default App
