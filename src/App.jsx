import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas";
import moment  from 'moment';
import 'moment/locale/es'; // Importar el idioma español



const styles = {
  fontFamily: "arial",
  textAlign: "center",
  padding: "50px",
};

const btnStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  borderRadius: "5px",
  outline: "none",
  fontSize: "20px",
};

// Estilo para el título
const titleStyle = {
  fontSize: 20,
  fontStyle: 'normal',
  textColor: 'Black',
};

// Estilo para el subtítulo
const subtitleStyle = {
  fontSize: 12,
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
  

  // Obtener la fecha actual y formatearla
  const currentDate = moment().locale("es").format('D [de] MMMM [de] YYYY');

  console.log(currentDate)

    const print = () => {
      const input = document.getElementById("printThis");
     
      const pdf = new jsPDF({
        format: [500, 1100] // Custom size: width = 500, height = 1100 (in units, default is mm)
      });

      pdf.setFont('helvetica');
      html2canvas(input, {scale:0.1}).then((canvas) => {
        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
        
          format: [800, 800]
      });
      
      pdf.setFont('helvetica');
    
      // Título
      pdf.setTextColor(titleStyle.textColor);
      pdf.setFontSize(titleStyle.fontSize);
      pdf.setFontStyle(titleStyle.fontStyle);
      pdf.text(100, 20, `Medellín, ${currentDate}`);
   
    
     
      pdf.save("download.pdf"); // Guarda el PDF
      });
    };

    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState('');

    const handleAddToCart = () => {
      const cleanedPrice = price.replace(/\./g, '');

      const newItem = {
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
    };

  const numberWithCommas = (value) => {
    // Convertir el valor a un número entero
    const intValue = parseInt(value.replace(/[^\d]/g, ''), 10);
    // Formatear el número con separadores de miles
    const formattedValue = intValue.toLocaleString('es-CO');
    return formattedValue;
  };
  



  return (
    <>
     <div className="cart-container">
     <p>Medellín, {currentDate}</p>
      <h2>Carrito de Compras</h2>
      <div className="input-container">
        <label>
          Concepto:
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
        <button onClick={handleAddToCart}>Agregar al Carrito</button>
      </div>
      <div className="items-container">
      {items.map((item, index) => (
        <div key={index} className="item">
          <p>Descripción: {item.name}</p>
          <p>Precio: ${parseInt(item.price).toLocaleString()}</p>
          <p>Cantidad: {item.quantity}</p>
          <p>Total: ${parseInt(item.price * item.quantity).toLocaleString()}</p>
        </div>
      ))}
</div>

<button onClick={print}>descargar pdf </button>
<div style={{ position: 'absolute', left: 50, top: -500 }}>
                <div id="printThis">
                
                </div>
              </div>
    </div>
    </>
  )
}

export default App
