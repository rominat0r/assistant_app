
'use client';
import Image from "next/image";
import { motion } from 'framer-motion';
import React, { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

import AudioStream from "./audio-stream";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className=" items-center justify-between font-mono text-sm lg:flex">

      <AudioStream  />

      </div>
    </main>
  );
  
}

