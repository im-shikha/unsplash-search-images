import { Button, Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const PER_PAGE = 25;

function App() {
  console.log("key", import.meta.env.VITE_IMAGE_API_KEY);
  const imageSearchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      if (imageSearchInput.current.value) {
        setErrorMessage("");
        const { data } = await axios.get(
          `${API_URL}?query=${
            imageSearchInput.current.value
          }&page=${page}&per_page=${PER_PAGE}&client_id=${
            import.meta.env.VITE_IMAGE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMessage("Something went wrong :(");
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleImageSearch = (event) => {
    event.preventDefault();
    console.log(imageSearchInput.current.value);
    resetSearch();
  };

  const handleSelection = (selection) => {
    imageSearchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="container">
      <h1 className="title">
        Search <span className="highlight">Images</span>
      </h1>
      {errorMessage && <p className="error-msg">{errorMessage}</p>}
      <div className="search-section">
        <Form onSubmit={handleImageSearch}>
          <Form.Control
            type="search"
            placeholder="Type something for image results..."
            className="search-input"
            ref={imageSearchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("flower")}>Flower</div>
        <div onClick={() => handleSelection("wallpapers")}>Wallpapers</div>
        <div onClick={() => handleSelection("backgrounds")}>Backgrounds</div>
        <div onClick={() => handleSelection("happy")}>Happy</div>
        <div onClick={() => handleSelection("love")}>Love</div>
      </div>
      {totalPages === 0 ? (
        <h1 className="no-results">No Images Found!</h1>
      ) : (
        <div className="images">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.urls.small}
              alt={image.alt_description}
              className="image"
            />
          ))}
        </div>
      )}

      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}>&larr; Prev</Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}>Next &rarr;</Button>
        )}
      </div>
    </div>
  );
}

export default App;
