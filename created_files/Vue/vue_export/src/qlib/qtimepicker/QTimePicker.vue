<template>
  <div class="time-picker" :style="mode !== 'input' ? { width: '450px', height: 'auto', transition: 'all 0.3s ease' } : { transition: 'all 0.3s ease' }">
    <h3>{{ mode === 'input' ? 'Enter time' : 'Select time' }}</h3>

    <div v-if="mode === 'input'" class="time-input">
      <div>
        <input
          type="number"
          class="time-box"
          min="1"
          max="12"
          v-model.number="hour"
          style="width: 85px"
        />
        <p style="font-size: 10px; padding: 5px">Hours</p>
      </div>

      <span class="colon" style="height: 60px">:</span>

      <div>
        <input
          type="number"
          class="time-box"
          min="0"
          max="59"
          v-model.number="minute"
          style="width: 85px"
        />
        <p style="font-size: 10px; padding: 5px">Minute</p>
      </div>

      <div class="ampm-toggle">
        <button :class="{ active: ampm === 'AM' }" @click="ampm = 'AM'">AM</button>
        <button :class="{ active: ampm === 'PM' }" @click="ampm = 'PM'">PM</button>
      </div>
    </div>

    <div v-else class="selectedClock">
      <div class="time-input">
        <input
          type="number"
          class="time-box"
          min="1"
          max="12"
          v-model.number="hour"
          style="width: 85px"
        />

        <span class="colon" style="height: 60px">:</span>

        <input
          type="number"
          class="time-box"
          min="0"
          max="59"
          v-model.number="minute"
          style="width: 85px"
        />
      </div>

      <div class="ampm-toggleS">
        <button
          :class="{ active: ampm === 'AM' }"
          @click="ampm = 'AM'"
          :style="{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }"
        >
          AM
        </button>
        <button
          :class="{ active: ampm === 'PM' }"
          @click="ampm = 'PM'"
          :style="{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }"
        >
          PM
        </button>
      </div>

      <svg width="250" height="250" class="clock-face">
        <!-- clock circle -->
        <circle :cx="center.x" :cy="center.y" :r="radius" stroke="" fill="transparent" />

        <!-- line from center to selected number -->
        <line
          v-if="selectedPoint !== null"
          :x1="center.x"
          :y1="center.y"
          :x2="hours[selectedPoint].x"
          :y2="hours[selectedPoint].y"
          stroke="#bb86fc"
          stroke-width="2"
        />

        <!-- numbers 1–12 -->
        <g
          v-for="(p, idx) in hours"
          :key="idx"
          @click="handleHourClick(idx)"
          style="cursor: pointer"
        >
          <!-- Highlight circle behind number if selected -->
          <circle
            v-if="selectedPoint === idx"
            :cx="p.x"
            :cy="p.y"
            r="20"
            fill="#bb86fc"
          />

          <!-- Number itself -->
          <text
            :x="p.x"
            :y="p.y + 6"
            text-anchor="middle"
            font-size="16"
            font-weight="bold"
            fill="white"
          >
            {{ idx + 1 }}
          </text>
        </g>

        <!-- center circle -->
        <circle :cx="center.x" :cy="center.y" r="6" fill="#bb86fc" />
      </svg>
    </div>

    <div class="footer">
      <button class="toggle-btn" @click="toggleMode">
        {{ mode === 'input' ? '🕒' : '⌨️' }}
      </button>

      <div style="display: flex; flex-direction: row; gap: 20px">
        <button class="cancel-btn">Cancel</button>
        <button class="ok-btn">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const mode = ref('input'); // 'input' or 'clock'
const hour = ref(12);
const minute = ref(0);
const ampm = ref('AM');
const selecting = ref('hour'); // 'hour' or 'minute' (not fully used yet)
const selectedPoint = ref(null); // index of selected hour (0-11)

const svgSize = 250;
const radius = 90;
const center = computed(() => ({ x: svgSize / 2, y: svgSize / 2 }));
const numberRadius = radius - 10;

// Hour positions (12 at top, starting from 1)
const hours = computed(() => {
  return Array.from({ length: 12 }, (_, i) => {
    // Angle: 12 is at -90 degrees (top), each hour 30 degrees
    const angle = ((i - 2) * 30 * Math.PI) / 180; // -90° offset so 12 is at top
    return {
      x: center.value.x + numberRadius * Math.cos(angle),
      y: center.value.y + numberRadius * Math.sin(angle),
    };
  });
});

// Set default to current time
onMounted(() => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';

  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  hour.value = h;
  minute.value = m;
  ampm.value = period;
});

const toggleMode = () => {
  mode.value = mode.value === 'input' ? 'clock' : 'input';
};

const handleHourClick = (idx) => {
  selectedPoint.value = idx;
  hour.value = idx + 1;
};
</script>

<style scoped>
.time-picker {
  width: 320px;
  height: 225px;
  padding: 16px;
  border-radius: 12px;
  background: #a60000;
  color: white;
  font-family: Arial, sans-serif;
}

.time-picker h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.time-box {
  height: 60px;
  background: #bb86fc;
  color: #00ffff;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  line-height: 60px;
  border-radius: 8px;
  border: none;
}

.time-box:focus {
  outline: none;
}

.colon {
  font-size: 28px;
  font-weight: bold;
}

.ampm-toggle {
  display: flex;
  margin-left: 12px;
  flex-direction: column;
}

.ampm-toggle button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  background: #333;
  color: white;
}

.ampm-toggle button.active {
  background: teal;
}

.clock-face {
  display: block;
  margin: 0 auto;
  background: transparent;
  border-radius: 50%;
}

.footer {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.cancel-btn {
  background: #f44336;
  border: none;
  padding: 6px 12px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 10px;
}

.ok-btn {
  background: #1976d2;
  border: none;
  padding: 6px 12px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 10px;
}

.selectedClock {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.ampm-toggleS {
  display: flex;
  flex-direction: row;
}

.ampm-toggleS button {
  padding: 5px 41px;
  border: none;
  cursor: pointer;
  background: #333;
  color: white;
  margin-top: 7px;
  font-size: 10px;
  border-radius: 2px;
}

.ampm-toggleS button.active {
  background: teal;
}
</style>