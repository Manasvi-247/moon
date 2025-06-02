const dateInput = document.getElementById('date');
  const moonImage = document.getElementById('moon-image');
  const phaseName = document.getElementById('phase-name');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  console.log(today);

  async function fetchMoonPhase(date) {
    try {
      const response = await fetch('https://moon-1.onrender.com/moon-phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch moon phase');
      }

      const data = await response.json();
      moonImage.src = data.imageUrl;
      phaseName.textContent = `Moon Phase on ${date}`;
    } catch (err) {
      phaseName.textContent = err.message;
      moonImage.src = '';
    }
  }

  dateInput.addEventListener('change', (e) => {
    fetchMoonPhase(e.target.value);
  });
  fetchMoonPhase(today);