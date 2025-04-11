/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

import React from 'react';

interface CopyrightWatermarkProps {
  opacity?: number;
}

const CopyrightWatermark: React.FC<CopyrightWatermarkProps> = ({ opacity = 0.075 }) => {
  return (
    <div 
      className="fixed pointer-events-none select-none z-[9999] inset-0 flex items-center justify-center"
      style={{
        opacity,
        transform: 'rotate(-45deg)',
      }}
    >
      <div className="text-[2vw] sm:text-[1.5vw] md:text-[1.2vw] whitespace-nowrap text-black dark:text-white font-bold tracking-wider uppercase">
        © 2025 vickymosafan - All Rights Reserved
      </div>
    </div>
  );
};

export default CopyrightWatermark;
