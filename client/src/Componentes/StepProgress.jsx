import React from 'react';
import './Estilos/StepProgress.css';

export default function StepProgress({currentStep, totalSteps}) {

  const percent = (currentStep / totalSteps) * 100;

  return (
    <div className="step-progress-container">
      <span className="step-progress-label">
        Paso {currentStep} de {totalSteps}
      </span>
      <div className="step-progress-track">
        <div
          className="step-progress-filled"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
