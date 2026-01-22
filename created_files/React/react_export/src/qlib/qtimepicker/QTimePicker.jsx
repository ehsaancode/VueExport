import React, { useState, useEffect } from "react";
import "./QTimePicker.css";

const QTimePicker = () => {
  const [mode, setMode] = useState("input"); // input or clock
 

  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const [ampm, setAmPm] = useState("AM");
  const [selecting, setSelecting] = useState("hour"); // hour or minute
  const [selectedPoint, setSelectedPoint] = useState(null); // stores index of selected number

   // Set default time to current local time
  useEffect(() => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    setHour(h);
    setMinute(m);
    setAmPm(period);
  }, []);



  const toggleMode = () => setMode(mode === "input" ? "clock" : "input");

  const svgSize = 250; // SVG width & height
  const radius = 90;   // clock radius
  const center = { x: svgSize / 2, y: svgSize / 2 }; // center of clock

  const numberRadius = radius - 10; // numbers slightly inward

  // calculate hour positions
  const hours = Array.from({ length: 12 }, (_, i) => {
  const angle = ((i - 2) * 30 * Math.PI) / 180; // 12 at top
  return {
    x: center.x + numberRadius * Math.cos(angle),
    y: center.y + numberRadius * Math.sin(angle),
  };
});

  return (
    <div className="time-picker" 
     style={
      
    mode !== "input"
      ? { width: "450px", height: "auto" ,  transition: 'all 0.3s ease',}
      : { transition: 'all 0.3s ease',}
  }
  >
      <h3>{mode === "input" ? "Enter time" : "Select time"}</h3>

      {mode === "input" ? (
        <div className="time-input">
          <div className="">
            <input
            type="number"
            className="time-box"
            min="1"
            max="12"
            value={hour}
            style={{ width: '85px'}}
            onChange={(e) => setHour(Number(e.target.value))}
          />
           <p style={{ fontSize: '10px', padding: '5px'}}> Hours</p>
          </div>
         

          <span className="colon" style={{ height: '60px'}}>:</span>
          <div className="">

           <input
            type="number"
            className="time-box"
            min="0"
            max="59"
             style={{ width: '85px'}}
            value={minute.toString().padStart(2, "0")}
            onChange={(e) => setMinute(Number(e.target.value))}
          />

          <p style={{ fontSize: '10px', padding: '5px'}}> Minute</p>
          </div>

          <div className="ampm-toggle">
            <button
              className={ampm === "AM" ? "active" : ""}
              onClick={() => setAmPm("AM")}
            >
              AM
            </button>
            <button
              className={ampm === "PM" ? "active" : ""}
              onClick={() => setAmPm("PM")}
            >
              PM
            </button>
          </div>
        </div>
      ) : (
        <div className="selectedClock">
          <div className="">
           <div className="time-input">
          <div className="">
            <input
            type="number"
            className="time-box"
            min="1"
            max="12"
            value={hour}
            style={{ width: '85px'}}
            onChange={(e) => setHour(Number(e.target.value))}
          />
          
          </div>
         
          <span className="colon" style={{ height: '60px'}}>:</span>
          <div className="">

           <input
            type="number"
            className="time-box"
            min="0"
            max="59"
             style={{ width: '85px'}}
            value={minute.toString().padStart(2, "0")}
            onChange={(e) => setMinute(Number(e.target.value))}
          />

         
          </div>
           </div>
            <div className="ampm-toggleS" >
            <button
           style={{
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
              className={ampm === "AM" ? "active" : ""}
              onClick={() => setAmPm("AM")}
            >
              AM
            </button>
            <button
             style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}
              className={ampm === "PM" ? "active" : ""}
              onClick={() => setAmPm("PM")}
            >
              PM
            </button>
          </div>
          
        </div>

      

          <svg width={svgSize} height={svgSize} className="clock-face">
          {/* clock circle */}
          <circle cx={center.x} cy={center.y} r={radius} stroke="" fill="transparent" />

          {/* line from center to selected number */}
          {selectedPoint !== null && (
            <line
              x1={center.x}
              y1={center.y}
              x2={hours[selectedPoint].x}
              y2={hours[selectedPoint].y}
              stroke="#bb86fc"
              strokeWidth="2"
            />
          )}

          {/* numbers 1–12 */}
          {hours.map((p, idx) => (
            <g
              key={idx}
              onClick={() => {
                setSelectedPoint(idx);
                 setHour(idx + 1);  
                }
              }
              style={{ cursor: "pointer" }}
            >
              {/* Highlight circle behind number if selected */}
              {selectedPoint === idx && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="20"          // radius of highlight circle
                  fill="#bb86fc"
                />
              )}

              {/* Number itself */}
              <text
                x={p.x}
                y={p.y + 6}   // vertical alignment
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="white"
              >
                {idx + 1}
              </text>
            </g>
          ))}

          {/* center circle */}
          <circle cx={center.x} cy={center.y} r="6" fill="#bb86fc" />
        </svg>
        </div>
     
      )}

      <div className="footer">
        <button className="toggle-btn" onClick={toggleMode}>
          {mode === "input" ? "🕒" : "⌨️"}
        </button>
         <div style={{ display: "flex", flexDirection: "row", gap: '20px'}}>
           <button className="cancel-btn">Cancel</button>
        <button className="ok-btn">OK</button>
         </div>
       
      </div>
    </div>
  );
};

QTimePicker.displayName = "QTimePicker";
export default QTimePicker;