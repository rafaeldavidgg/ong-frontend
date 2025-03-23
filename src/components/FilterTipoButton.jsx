import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { getTipoActividades } from "../services/tipoActividadService";
import "./css/FilterTipoButton.css";

const FilterTipoButton = ({ onFilter, activeFilter, onClearFilter }) => {
  const [showInput, setShowInput] = useState(false);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchTipos = async () => {
      const data = await getTipoActividades(1, 100);
      const options = data.tipoActividades.map((tipo) => ({
        value: tipo._id,
        label: tipo.nombreTipo,
      }));
      setTipoOptions(options);
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };
    if (showInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInput]);

  const handleApplyFilter = () => {
    const values = selectedOptions.map((opt) => opt.value);
    onFilter(values);
    setShowInput(false);
  };

  return (
    <div className="filtertipo-btn-container" ref={inputRef}>
      <button
        className="filtertipo-btn"
        onClick={() => setShowInput(!showInput)}
      >
        {activeFilter && activeFilter.length > 0 ? (
          <>
            Tipos{""}
            <button
              className="clear-filter"
              onClick={(e) => {
                e.stopPropagation();
                onClearFilter();
              }}
              aria-label="Eliminar filtro"
              tabIndex={0}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </>
        ) : (
          <>
            Tipo <i className="bi bi-chevron-down"></i>
          </>
        )}
      </button>

      {showInput && (
        <div className="filtertipo-input-container">
          <Select
            isMulti
            placeholder="Selecciona tipos..."
            options={tipoOptions}
            value={selectedOptions}
            onChange={setSelectedOptions}
            classNamePrefix="select"
          />
          <button onClick={handleApplyFilter} className="apply-filter-btn">
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
};

FilterTipoButton.propTypes = {
  onFilter: PropTypes.func.isRequired,
  activeFilter: PropTypes.array,
  onClearFilter: PropTypes.func.isRequired,
};

export default FilterTipoButton;
