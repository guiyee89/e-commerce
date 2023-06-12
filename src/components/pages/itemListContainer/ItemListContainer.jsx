import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemList } from "./ItemList";
import { products } from "../../ProductsMock";

export const ItemListContainer = () => {
  //Guardamos los items
  const [items, setItems] = useState([]);

  //useParams de react-router-dom para filtrar productos por categoryName
  const { categoryName } = useParams();

  //Funcion con useEffect para filtrar productos
  useEffect(() => {
    const productosFiltrados = products.filter(
      (product) => product.category === categoryName
    );
    //Promesa para que se resuelva que tipo de productos mostrar
    const productosPromesa = new Promise((resolve) => {
      setTimeout(() => {
        resolve(categoryName ? productosFiltrados : products);
      }, 500);
      //Una vez resuelto, mostrar dichos productos
    });
    productosPromesa
      .then((response) => setItems(response))
      .catch((error) => console.log(error))
    //Cierro con arreglo de dependencia para ejectuar cada vez que cambie "categoryName"
  }, [categoryName]);

  return <ItemList items={items} products={products} />;
  
};
