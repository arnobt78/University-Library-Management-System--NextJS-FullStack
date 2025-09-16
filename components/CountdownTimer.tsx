"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface CountdownTimerProps {
  dueDate: Date;
  borrowDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  dueDate,
  borrowDate: _borrowDate,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOverdue: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const calculateTimeLeft = () => {
      try {
        const now = new Date().getTime();
        const due = new Date(dueDate).getTime();
        const difference = due - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({
            days,
            hours,
            minutes,
            seconds,
            isOverdue: false,
          });
        } else {
          const overdueDays = Math.floor(
            Math.abs(difference) / (1000 * 60 * 60 * 24)
          );
          const overdueHours = Math.floor(
            (Math.abs(difference) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const overdueMinutes = Math.floor(
            (Math.abs(difference) % (1000 * 60 * 60)) / (1000 * 60)
          );
          const overdueSeconds = Math.floor(
            (Math.abs(difference) % (1000 * 60)) / 1000
          );

          setTimeLeft({
            days: overdueDays,
            hours: overdueHours,
            minutes: overdueMinutes,
            seconds: overdueSeconds,
            isOverdue: true,
          });
        }
      } catch (error) {
        console.warn("Error calculating time left:", error);
      }
    };

    calculateTimeLeft();
    timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [dueDate]);

  const getBadgeVariant = () => {
    if (timeLeft.isOverdue) return "destructive";
    if (timeLeft.days <= 1) return "destructive";
    if (timeLeft.days <= 3) return "secondary";
    return "default";
  };

  const getBadgeText = () => {
    if (timeLeft.isOverdue) {
      return `Overdue: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `Remaining: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
  };

  return (
    <Badge variant={getBadgeVariant()} className="font-mono text-xs">
      {getBadgeText()}
    </Badge>
  );
};

export default CountdownTimer;
