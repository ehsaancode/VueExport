import React, { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./QDateRangePicker.css";

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

const QDateRangePicker = () => {
  const [range, setRange] = useState();
  const today = new Date();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [startInput, setStartInput] = useState("");
  const startInputRef = useRef(null);
  const [isEndFocused, setIsEndFocused] = useState(false);
  const [endInput, setEndInput] = useState("");
  const endInputRef = useRef(null);

  // Start with 12 months (6 before today, 6 after today)
  const initialMonths = Array.from({ length: 12 }, (_, i) =>
    addMonths(today, i - 6)
  );

  const [months, setMonths] = useState(initialMonths);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Center scroll at current month
      const midIndex = 6; // today is at index 6
      const currentMonthEl =
        scrollRef.current.querySelectorAll(".rdp-month")[midIndex];
      if (currentMonthEl) {
        currentMonthEl.scrollIntoView({ block: "center" });
      }
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Near top → prepend more months
    if (scrollTop < 100) {
      setMonths((prev) => {
        const first = prev[0];
        const more = Array.from({ length: 6 }, (_, i) =>
          addMonths(first, -(i + 1))
        ).reverse();
        return [...more, ...prev];
      });
      scrollRef.current.scrollTop = scrollTop + 6 * 300; // keep anchor
    }

    // Near bottom → append more months
    if (scrollTop + clientHeight > scrollHeight - 100) {
      setMonths((prev) => {
        const last = prev[prev.length - 1];
        const more = Array.from({ length: 6 }, (_, i) =>
          addMonths(last, i + 1)
        );
        return [...prev, ...more];
      });
    }
  };


  useEffect(() => {
  const btns = document.querySelectorAll(".has-tooltip");
  btns.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      const rect = btn.getBoundingClientRect();
      if (rect.left < 100) {
        btn.classList.add("tooltip-right");
        btn.classList.remove("tooltip-left");
      } else if (window.innerWidth - rect.right < 100) {
        btn.classList.add("tooltip-left");
        btn.classList.remove("tooltip-right");
      } else {
        btn.classList.remove("tooltip-left", "tooltip-right");
      }
    });
  });
}, []);


  return (
    <div
      className="date-range-wrapper"
      style={{
          transition: 'all 0.3s ease',
        height: isEditMode == true ? "190px" : "",
        borderRadius: isEditMode == true ? "30px" : "8px",
        padding: isEditMode == true ? "15px" : "",
        width: isEditMode == true ? "380px" : "",
      }}
    >
      {isEditMode == false ? (
        <>
          <div className="header">
            <div className="topHeader">
              <button
                data-tooltip="Close"
                className="close-btn icon-btn has-tooltip"
              >
                ✕
              </button>
              <div className="saveEdit">
                <button
                  data-tooltip="Switch to input"
                  className="icon-btn has-tooltip"
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                    <path d="M14.06 6.19l3.75 3.75" />
                  </svg>
                </button>
                <button className="save-btn">Save</button>
              </div>
            </div>

            <div className=" title">
              <p className="subtitle">Select range</p>
              <h3>
                {range?.from
                  ? range.from.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "Start Date"}{" "}
                –{" "}
                {range?.to
                  ? range.to.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "End Date"}
              </h3>
            </div>
          </div>

          <div className="calendar-container">
            <div className="weekday-header">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            <div
              className="calendar-scroll"
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {months.map((month) => (
                <DayPicker
                  key={month.toISOString()}
                  mode="range"
                  month={month}
                  showOutsideDays={false} // ⬅️ hide prev/next month days
                  selected={range}
                  onSelect={setRange}
                  fixedWeeks
                  numberOfMonths={1}
                  components={{
                    Caption: () => null,
                    Head: () => null,
                    Nav: () => null,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="editDateRange">
            <div className="editDateRange1St">
              <p style={{ paddingBottom: "25px" }}>Select range</p>
              <p style={{ fontSize: "22px" }}>
                Date <br />
                Range
              </p>
            </div>

            <div className="editDateRange2nd">
              <div className="input-mode-container">
                <div className="input-fields">
                  <div
                    className={`input-group ${
                      isStartFocused || startInput ? "focused" : ""
                    }`}
                  >
                    <label>Start ...</label>
                    <input
                      ref={startInputRef}
                      type="text"
                      placeholder={isStartFocused ? "mm/..." : ""}
                      value={startInput}
                      onChange={(e) => setStartInput(e.target.value)}
                      onFocus={() => setIsStartFocused(true)}
                      onBlur={() => setIsStartFocused(false)}
                    />
                  </div>

                  <div
                    className={`input-group ${
                      isEndFocused || endInput ? "focused" : ""
                    }`}
                  >
                    <label>End D...</label>
                    <input
                      ref={endInputRef}
                      type="text"
                      placeholder={isEndFocused ? "mm/..." : ""}
                      value={endInput}
                      onChange={(e) => setEndInput(e.target.value)}
                      onFocus={() => setIsEndFocused(true)}
                      onBlur={() => setIsEndFocused(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="editRangeDateFooter">
            <div className="editRangeDateFooter1st">
              <button
                data-tooltip="Switch to calendar"
                className="icon-btn has-tooltip"
                onClick={() => {
                  setIsEditMode(!isEditMode);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </button>
            </div>

             <div>
                <button className="cancel-btn">Cancel</button>
                <button className="ok-btn">OK</button>
             </div>   
            
          </div>
        </>
      )}
    </div>
  );
};
QDateRangePicker.displayName = "QDateRangePicker";
export default QDateRangePicker;

