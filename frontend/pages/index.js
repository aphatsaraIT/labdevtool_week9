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
      <h1 style={{ textAlign: "center", color: "pink" }}>
        Welcome Software Tools
      </h1>
      <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <div style={{ flexDirection: "row", top: "15%", justifyContent: "center"}}>
          <input
            style={{ padding: "5px", borderRadius: "5px", margin: 4 }}
            type={"text"}
            onChangeText={onChangeNameHandler}
            placeholder={"name"}
          />
          <input
            style={{ padding: "5px", borderRadius: "5px", margin: 4 }}
            type={"text"}
            onChangeText={onChangeSurnameHandler}
            placeholder={"surname"}
          />
          <input
            style={{ padding: "5px", borderRadius: "5px", margin: 4 }}
            type={"text"}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder={"numbers"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", top: "20%", justifyContent: "center" }}>
          <input
            style={{ padding: "5px", borderRadius: "5px" }}
            id="input"
            type="file"
            onChange={() => handleChange()}
          />
          <button
            className="btn btn-secondary"
            style={{ padding: "5px", borderRadius: "5px", backgroundColor: 'pink', color: 'white' }}
            onClick={() => sendImage()}
          >
            Send
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
  );
}

export const getServerSideProps = async (context) => ({
  props: { host: context.req.headers.host || null },
});
