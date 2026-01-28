import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./QDatePicker.css";

const QDatePicker = ({
  backgroundColor = "red",
  textColor = "#004d00",
  activeBgColor = "black",
  activeTextColor = "blue",
  okBtnBg = "#1976d2",
  okBtnText = "#fff",
  cancelBtnBg = "#f44336",
  cancelBtnText = "#fff",
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [isYearView, setIsYearView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOk = () => {
    setSelectedDate(tempDate);
    setIsYearView(false); // reset back to month view
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    setIsYearView(false); // reset back to month view
  };

  const years = Array.from({ length: 12 }, (_, i) => 2018 + i);

  const CalendarContainer = ({ className, children }) => {
    const prevMonth = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth() - 1,
      1
    );
    const nextMonth = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth() + 1,
      1
    );

    return (
      <div 
       className="datepicker-wrapper"
        style={{
          "--calendar-bg": backgroundColor,
          "--calendar-text": textColor,
          "--calendar-active-bg": activeBgColor,
          "--calendar-active-text": activeTextColor,
          "--calendar-ok-bg": okBtnBg,
          "--calendar-ok-text": okBtnText,
          "--calendar-cancel-bg": cancelBtnBg,
          "--calendar-cancel-text": cancelBtnText,
        }}

      >
        {/* Left Preview */}
        <div className="datepicker-left">
          <p>Select date</p>
          <h3 className="showDate" style={{ fontSize: isEditMode? '20px': ''}}>
            {tempDate.toLocaleDateString("en-US", { weekday: "short" })},{" "}
            {tempDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </h3>
        </div>

        {/* Right Calendar */}
        <div className={`${className} datepicker-right`}>
          {/* Custom header (hide in edit mode) */}
          {!isEditMode && (
            <div className="custom-header">
              <span
                onClick={() => setIsYearView(!isYearView)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                {tempDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </span>

              {/* Show prev/next only in month mode */}
              {!isYearView && (
                <div style={{ display: "flex", gap: 6 }}>
                  {/* Prev */}
                  <button
                    className="nav-btn icon-btn has-tooltip"
                    data-tooltip={`Previous: ${prevMonth.toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}`}
                    onClick={() =>
                      setTempDate(
                        new Date(
                          tempDate.getFullYear(),
                          tempDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                    aria-label="Previous month"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {/* Next */}
                  <button
                    className="nav-btn icon-btn has-tooltip edge-right"
                    data-tooltip={`Next: ${nextMonth.toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}`}
                    onClick={() =>
                      setTempDate(
                        new Date(
                          tempDate.getFullYear(),
                          tempDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                    aria-label="Next month"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Calendar + Footer */}
          <div
            className={`calendar-content ${
              isYearView ? "year-mode" : "month-mode"
            }`}
          >
            {!isEditMode ? (
              isYearView ? (
                <div className="year-grid">
                  {years.map((yr) => (
                    <div
                      key={yr}
                      className={`year-cell ${
                        yr === tempDate.getFullYear() ? "selected" : ""
                      }`}
                      onClick={() => {
                        const d = new Date(tempDate);
                        d.setFullYear(yr);
                        setTempDate(d);
                        setIsYearView(false);
                      }}
                    >
                      {yr}
                    </div>
                  ))}
                </div>
              ) : (
                children // normal month calendar
              )
            ) : (
              // Input wrapper shown only in edit mode
              <div className="input-wrapper">
                <input type="text" id="dateInput" placeholder="mm/dd/yyyy" />
                <label htmlFor="dateInput">Enter Date</label>
              </div>
            )}

            <div
              className={`calendar-footer ${
                isYearView ? "year-mode" : "month-mode"
              }`}
            >
              <button
                className="cancel-btn"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
              <button className="ok-btn" onClick={handleOk} type="button">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom-left toggle icon */}
        <button
          className="editIcon icon-btn has-tooltip"
          data-tooltip={isEditMode ? "Switch to calendar" : "Switch to input"}
          type="button"
          aria-label="Switch mode"
          onClick={() => {
            if (isEditMode) {
              setIsYearView(false); // reset to month view when going back to calendar
            }
            setIsEditMode(!isEditMode);
          }}
        >
          {isEditMode ? (
            // 📅 Calendar icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v2h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM4 11v8h16v-8H4z" />
            </svg>
          ) : (
            // ✏️ Edit icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
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
          )}
        </button>
      </div>
    );
  };

  return (
    <DatePicker
      selected={tempDate}
      onChange={(date) => setTempDate(date)}
      calendarContainer={CalendarContainer}
      calendarClassName="custom-calendar"
      inline
      renderDayContents={(day) => <span>{day}</span>}
      dayClassName={() => "day-cell"}
      formatWeekDay={(day) => day.charAt(0)} // Show single letter for top bar
    />

    
  );
};


QDatePicker.displayName = "QDatePicker";
export default QDatePicker;
