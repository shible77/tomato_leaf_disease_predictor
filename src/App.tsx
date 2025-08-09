import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import SimpleSpinner from './components/spinner'

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<{
    class: string;
    confidence: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImageURL(URL.createObjectURL(e.target.files[0]));
      setPrediction(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://tomato-leaf-disease-detection-api.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.detail || "Failed to get prediction");
      } else {
        alert("Failed to get prediction");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPrediction(null);
    setImageURL(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">
        Tomato Leaf Disease Identifier
      </h1>
      <div className="w-full flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-3 bg-gray-100 rounded file:cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
        />
      </div>

      {imageURL ? (
        <img
          src={imageURL}
          alt="Preview"
          className="w-60 h-60 object-contain rounded-lg shadow border mb-3"
          onLoad={handleSubmit}
        />
      ) : (
        <div className="w-60 h-60 flex items-center justify-center border border-dashed border-gray-400 rounded-lg text-gray-400 mb-2">
          Upload an image to preview
        </div>
      )}

      {loading && (
        <SimpleSpinner  />
      )}

      {prediction && (
        <div className="text-center mt-2">
          <p className="text-xl font-semibold text-green-800">Prediction:</p>
          <p className="text-2xl text-red-600 font-bold mt-1">
            {prediction.class}
          </p>
          <p className="text-sm text-gray-700">
            Confidence: {prediction.confidence.substring(0, 5)}%
          </p>
        </div>
      )}

      {(prediction && imageURL) && (
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
        >
          Try Another Image
        </button>
      )}
    </div>
  );
}
