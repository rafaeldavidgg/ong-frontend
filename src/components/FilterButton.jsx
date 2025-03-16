import { useState, useEffect, useRef } from "react";
import "./css/FilterButton.css";

const FilterButton = ({ onFilter, activeFilter, onClearFilter }) => {
  const [showInput, setShowInput] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const inputRef = useRef(null);

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
    if (
      filterValue.trim() !== "" &&
      !isNaN(filterValue) &&
      Number(filterValue) > 0
    ) {
      onFilter(Number(filterValue));
      setShowInput(false);
    }
  };

  return (
    <div className="filter-btn-container" ref={inputRef}>
      <button className="filter-btn" onClick={() => setShowInput(!showInput)}>
        {activeFilter ? (
          <>
            Grupo: {activeFilter}{" "}
            <button
              className="clear-filter"
              onClick={onClearFilter}
              aria-label="Eliminar filtro"
              tabIndex={0}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </>
        ) : (
          <>
            Grupo de trabajo <i className="bi bi-chevron-down"></i>
          </>
        )}
      </button>

      {showInput && (
        <div className="filter-input-container">
          <input
            type="number"
            placeholder="Grupo"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="filter-input"
          />
          <button onClick={handleApplyFilter} className="apply-filter-btn">
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
