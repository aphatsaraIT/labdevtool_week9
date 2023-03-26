import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import react, { useState } from 'react'
import { headers } from '../next.config'
import styles from '../styles/Home.module.css'


export default function Home({ host }) {
  const hostname = host.substring(0, host.indexOf(":"));
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [data, setData] = useState(null);
  const onChangeNameHandler = (name) => {
    setName(name);
  };
  const onChangeSurnameHandler = (surname) => {
    setSurname(surname);
  };
  const handleChange = (event) => {
    let input = document.getElementById("input");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = (e) => {
      console.log(e.target.result);
      setImage(e.target.result);
    };
  };
  const sendImage = async () => {
    let sendNumber = numbers.split(" ");
    try {
      const result = await axios.post(
        `http://${hostname}:8088/process-image`,
        { image: image, name: name, surname: surname, numbers: sendNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setData(result.data);
      setShowImage(result.data.processed_image);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.container}>
      <div className="row mt-4">
      <div className="col-12 col-md-6 offset-md-3">
      <h2 className="my-4 text-center">Software Devtool</h2>
        <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="form-group">
                <label for="name">Your Name</label>
                <input
                   onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group" style={{ marginLeft: 10 }}>
                <label for="surname">Your Surname</label>
                <input
                  onChange={(e) => setSurname(e.target.value)}
                  type="text"
                  className="form-control"
                  id="surname"
                  placeholder="Enter your surname"
                />
              </div>
              <div className="form-group" style={{ marginLeft: 10 }}>
                <label for="number">Your Susent ID</label>
                <input
                 onChange={(e) => setNumbers(e.target.value)}
                  type="text"
                  className="form-control"
                  id="number"
                  placeholder="Enter your student id"
                />
              </div>
            </div>
     
        <div style={{ display: "flex", flexDirection: "row", top: "20%", justifyContent: "center" }}>
        <div className="form-group">
              <input id="input" type="file" onChange={() => handleChange()} />
             </div>
          <button type="submit" className="btn btn-primary"  onClick={() => sendImage()}>
              Submit
          </button>
        </div>
      </div>
      {image && (
        <div
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            id="image"
            width={500}
            height={350}
            src={image}
            alt="img"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {showImage && (
          <Image
            id="image2"
            width={500}
            height={350}
            src={showImage}
            alt="img output"
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
      {data && (
        <div>
          <div>{data.name + " " + data.surname}</div>
          <ul>
            {data.numbers.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => ({
  props: { host: context.req.headers.host || null },
});
