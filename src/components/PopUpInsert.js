import React, { useEffect, useState } from "react";
import styled from "styled-components";
import closeIcon from "../icons/close_icon.svg";
import cameraIcon from "../icons/photo_icon.svg";
import plusIcon from "../icons/plus_icon.svg";
import axios from "axios";
import { PopUp } from "./StyledComponents/PopUp.js";
import { Overlay } from "./StyledComponents/Overlay.js";
import { CloseButtonArea } from "./StyledComponents/CloseButtonArea.js";
import { CloseButton } from "./StyledComponents/CloseButton.js";
import { AddButton } from "./StyledComponents/AddButton.js";

const PopUpInsert = ({ popUpState, setPopUpState, title, setUpdate }) => {
  const [uploadedFiles, setUploadedFiles] = useState("");
  const [photoNumber, setPhotoNumber] = useState(0);

  //Prevent from reload after dragging the photos
  const dragHandler = (e) => {
    e.preventDefault();
  };
  //Save dropped photos as a state
  const fileDropHandler = (e) => {
    e.preventDefault();
    fileFormatCheck(e.dataTransfer.files);
  };
  //Save selected photos as a state
  const fileSelectHandler = () => {
    let imagedata = document.querySelector('input[type="file"]').files;
    fileFormatCheck(imagedata);
  };
  //Check for correct file format
  const fileFormatCheck = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type !== "image/jpeg") {
        alert(
          "Nesprávny formát. Použite prosím iba fotografie vo formáte JPG."
        );
        setUploadedFiles("");
        setPhotoNumber(0);
        break;
      } else {
        setUploadedFiles(files);
        setPhotoNumber(files.length);
      }
    }
  };

  //Create a formData object to store uploaded photos
  const postPhotosHandler = (e) => {
    e.preventDefault();
    let data = new FormData();
    for (let i = 0; i < uploadedFiles.length; i++) {
      data.append(uploadedFiles[i].name, uploadedFiles[i]);
    }
    //Send uploaded photos to a server
    axios
      .post(`http://api.programator.sk/gallery/${title}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        //Display new added photos in a specific gallery
        setUpdate(Math.random);
      })
      .catch((err) => console.log(err));
  };

  //Close pop by pressing escape
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape" && popUpState.photos === true) {
        closePopUp();
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
    };
  }, [popUpState.photos]);

  const closePopUp = () => {
    setPopUpState({ ...popUpState, photos: !popUpState.photos });
    setUploadedFiles("");
    setPhotoNumber(0);
  };

  return (
    <>
      <Overlay
        className={` ${popUpState.photos ? "active" : ""}`}
        onClick={closePopUp}
      ></Overlay>
      <PopUp className={`${popUpState.photos ? "active" : ""}`}>
        <CloseButtonArea
          onClick={() => {
            closePopUp();
          }}
        >
          <CloseButton>
            <img src={closeIcon} alt="close X" />
            zavrieť
          </CloseButton>
        </CloseButtonArea>
        <PhotosForm
          onSubmit={(e) => {
            if (uploadedFiles === "") {
              e.preventDefault();
              alert(
                "Neboli vybraté žiadne fotografie. Vyberte súbory vo formáte JPG alebo ich pretiahnite do vyznačenej oblasti."
              );
            } else {
              closePopUp();
              postPhotosHandler(e);
            }
          }}
        >
          <h2>Pridať fotky</h2>
          <DragArea
            onDragOver={dragHandler}
            onDragEnter={dragHandler}
            onDragLeave={dragHandler}
            onDrop={fileDropHandler}
          >
            <img src={cameraIcon} alt="camera icon" />
            <p>sem presunte fotky</p>
            <span>alebo</span>
            <label htmlFor="file">Vyberte súbory</label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/png, image/jpeg"
              multiple="multiple"
              onChange={fileSelectHandler}
            />
            <UploadInfo
              style={{ display: photoNumber === 0 ? "none" : "block" }}
            >
              Počet nahratých fotiek: {photoNumber}
            </UploadInfo>
          </DragArea>
          <AddButtonInsert type="submit">
            <img src={plusIcon} alt="plus icon " />
            Pridať
          </AddButtonInsert>
        </PhotosForm>
      </PopUp>
    </>
  );
};
export default PopUpInsert;

const PhotosForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  padding: 2.5em;
  h2 {
    font-size: 2.4rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 1.5em;
  }
`;
const DragArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px dashed #eee;
  padding: 3em;
  color: #aaa;
  text-align: center;
  p {
    font-size: 1.6rem;
    font-weight: 500;
    text-transform: uppercase;
    padding: 1em 0 0.5em;
  }
  span {
    font-size: 1.4rem;
    font-weight: 400;
    padding-bottom: 0.5em;
  }
  label {
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: medium;
    text-transform: uppercase;
    border: 3px solid #a9a9a9;
    border-radius: 5px;
    padding: 0.5em 1.5em;
    text-align: center;
  }
  input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
`;

const AddButtonInsert = styled(AddButton)`
  align-self: flex-end;
  margin-top: 2em;
`;
const UploadInfo = styled.h4`
  font-size: 1.6rem;
  margin-top: 1em;
  font-weight: 500;
  color: green;
`;
