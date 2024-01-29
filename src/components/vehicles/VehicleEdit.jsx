import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";

const VehicleEdit = () => {
  const { id } = useParams();
  const storage = getStorage();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userRole } = useAuth();
  // Verifica si el usuario tiene el rol necesario
  if (!["VENDEDOR", "SUPERVISOR", "ADMINISTRADOR"].includes(userRole)) {
    return (
      <div className="container">
        <h3>No tienes permisos para acceder a esta página.</h3>
      </div>
    );
  }
  const db = getFirestore();

  const subirArchivo = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    try {
      const storageRef = ref(storage, `vehiclesimg/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      console.log("Terminó la descarga...");

      const url = await getDownloadURL(storageRef);
      console.log("URL de descarga:", url);

      setVehicleData((prevData) => ({
        ...prevData,
        IMAGEN: {
          ...prevData.IMAGEN,
          DESTACADA: url,
        },
      }));

      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
  };

  const [vehicleData, setVehicleData] = useState({
    // Inicializa los campos según tus necesidades
    CONCESIONARIO: "SUPERAUTO",
    DOMINIO: "",
    ESTADOACTIVO: false,
    IMAGEN: {
      DESTACADA: "",
      FRENTE: "",
      INTERIOR: "",
      LATERAL: "",
      TRASERA: "",
    },
    STOCK: "",
    YEAR: "",
    combustible: "",
    destacado: "",
    kms: "",
    marca: "",
    modelo: "",
    precio: "",
    version: "",
  });

  useEffect(() => {
    if (!id) {
      console.error("El vehicleId no está definido correctamente.");
      return;
    }

    const fetchVehicleData = async () => {
      try {
        const vehicleDocRef = doc(db, "automotores", id);
        const vehicleSnapshot = await getDoc(vehicleDocRef);

        if (vehicleSnapshot.exists()) {
          // Obtiene los datos del vehículo y actualiza el estado
          setVehicleData(vehicleSnapshot.data());
        } else {
          console.error("El vehículo no existe");
          // Maneja la situación en la que el vehículo no existe
        }
      } catch (error) {
        console.error("Error al obtener datos del vehículo:", error);
      }
    };

    fetchVehicleData();
  }, [db, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const storageRef = ref(storage, `vehiclesimg/${file.name}`);
      await uploadBytes(storageRef, file);
      console.log("Terminó la descarga...");

      const url = await getDownloadURL(storageRef);
      console.log("URL de descarga:", url);

      setVehicleData((prevData) => ({
        ...prevData,
        IMAGEN: {
          ...prevData.IMAGEN,
          [type]: url,
        },
      }));
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Actualiza los datos del vehículo en Firestore
    try {
      const vehicleDocRef = doc(db, "automotores", id);
      await updateDoc(vehicleDocRef, vehicleData);

      // Aquí puedes manejar el redireccionamiento o cualquier otra acción necesaria
      console.log("Datos del vehículo actualizados con éxito");
    } catch (error) {
      console.error("Error al actualizar datos del vehículo:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card card-body shadow">
            <form onSubmit={handleSubmit}>
              <h3 className="title">Editar Vehículo</h3>

              {/* Aquí debes agregar campos de formulario según tus necesidades */}
              <Form.Group controlId="formMarca">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={vehicleData.marca}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formModelo">
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  name="modelo"
                  value={vehicleData.modelo}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formVersion">
                <Form.Label>Versión</Form.Label>
                <Form.Control
                  type="text"
                  name="version"
                  value={vehicleData.version}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formYear">
                <Form.Label>Año</Form.Label>
                <Form.Control
                  type="text"
                  name="YEAR"
                  value={vehicleData.YEAR}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formDominio">
                <Form.Label>Patente/Dominio</Form.Label>
                <Form.Control
                  type="text"
                  name="DOMINIO"
                  value={vehicleData.DOMINIO}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formCombustible">
                <Form.Label>Tipo de Combustible</Form.Label>
                <Form.Control
                  type="text"
                  name="combustible"
                  value={vehicleData.combustible}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formKms">
                <Form.Label>Kilómetros</Form.Label>
                <Form.Control
                  type="text"
                  name="kms"
                  value={vehicleData.kms}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formPrecio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="text"
                  name="precio"
                  value={vehicleData.precio}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formEstadoActivo">
                <Form.Label>¿Activo?</Form.Label>
                <Form.Control
                  type="text"
                  name="activo"
                  value={vehicleData.ESTADOACTIVO}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDestacado">
                <Form.Label>Destacado</Form.Label>
                <Form.Control
                  type="text"
                  name="destacado"
                  value={vehicleData.destacado}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <label htmlFor="imagenDestacada" className="form-label">
                Imagen Destacada
              </label>
              <input
                type="file"
                accept="image/*"
                id="imagenDestacada"
                onChange={(e) => handleImageUpload(e, "DESTACADA")}
              />
              <button type="button" onClick={subirArchivo}>
                Subir Imagen
              </button>
              <label htmlFor="imagenFrente" className="form-label">
                Imagen Frente
              </label>
              <input
                type="file"
                accept="image/*"
                id="imagenFrente"
                onChange={(e) => handleImageUpload(e, "FRENTE")}
              />
              <button type="button" onClick={subirArchivo}>
                Subir Imagen
              </button>
              <label htmlFor="imagenInterior" className="form-label">
                Imagen Interior
              </label>
              <input
                type="file"
                accept="image/*"
                id="imagenInterior"
                onChange={(e) => handleImageUpload(e, "INTERIOR")}
              />
              <button type="button" onClick={subirArchivo}>
                Subir Imagen
              </button>
              <label htmlFor="imagenLateral" className="form-label">
                Imagen Lateral
              </label>
              <input
                type="file"
                accept="image/*"
                id="imagenLateral"
                onChange={(e) => handleImageUpload(e, "LATERAL")}
              />
              <button type="button" onClick={subirArchivo}>
                Subir Imagen
              </button>
              <label htmlFor="imagenTrasera" className="form-label">
                Imagen Trasera
              </label>
              <input
                type="file"
                accept="image/*"
                id="imagenTrasera"
                onChange={(e) => handleImageUpload(e, "TRASERA")}
              />
              <button type="button" onClick={subirArchivo}>
                Subir Imagen
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleEdit;
