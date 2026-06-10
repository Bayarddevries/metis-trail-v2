const Haptics = (() => {
  const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  function fire(pattern) {
    if (supported) {
      try { navigator.vibrate(pattern); } catch(e) {}
    }
  }
  return {
    travel:       () => fire(15),
    wear:         () => fire([30, 50, 30]),
    roughTrail:   () => fire([80, 40, 80, 40, 80]),
    riverFail:    () => fire([200, 100, 300]),
    foodCritical: () => fire([50, 100, 50, 100, 50]),
    diceRoll:     () => fire([10,20,10,20,10,20,10]),
    arrive:       () => fire([25, 80, 25]),
    uiTap:        () => fire(8),
    stop:         () => { if (supported) navigator.vibrate(0); }
  };
})();
export default Haptics;
