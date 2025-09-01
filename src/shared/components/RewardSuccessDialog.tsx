'use client';

import React, { useEffect, useState } from 'react';
import { Award, Check, Gift, Star, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/ui/dialog';

interface RewardSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  amount: number;
}

export function RewardSuccessDialog({ 
  isOpen, 
  onClose, 
  participantName, 
  amount 
}: RewardSuccessDialogProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      // 3초 후 자동 닫기
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setTimeout(onClose, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div 
          className={`
            relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 
            rounded-2xl p-8 text-white shadow-2xl
            transform transition-all duration-500 ease-out
            ${showAnimation ? 'animate-in slide-in-from-top-4 zoom-in-95' : 'animate-out slide-out-to-top-4 zoom-out-95'}
          `}
        >
          {/* 배경 파티클 효과 */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 bg-white/30 rounded-full
                  animate-ping animation-delay-[${i * 100}ms]
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: `${1000 + Math.random() * 1000}ms`
                }}
              />
            ))}
          </div>

          {/* 메인 아이콘 */}
          <div className="relative text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-bounce">
              <Award className="w-10 h-10 text-white" />
            </div>
            
            {/* 떨어지는 별들 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`
                    absolute w-4 h-4 text-yellow-300 fill-current
                    animate-bounce animation-delay-[${i * 200}ms]
                  `}
                  style={{
                    left: `${(i - 2) * 20}px`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* 성공 메시지 */}
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-white mr-2" />
              <h2 className="text-2xl font-bold">포상 지급 완료!</h2>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="text-lg">
                <span className="font-semibold text-yellow-200">{participantName}</span>님에게
              </p>
              <div className="flex items-center justify-center">
                <Gift className="w-5 h-5 mr-2" />
                <span className="text-xl font-bold text-yellow-200">
                  {amount.toLocaleString()}원
                </span>
              </div>
              <p className="text-white/90">
                포상이 성공적으로 지급되었습니다
              </p>
            </div>

            {/* 축하 이모지 */}
            <div className="flex justify-center space-x-2 text-2xl animate-pulse">
              🎉 🎊 🏆 🎊 🎉
            </div>
          </div>

          {/* 떨어지는 스파클 */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Sparkles
                key={i}
                className={`
                  absolute w-6 h-6 text-yellow-300 opacity-70
                  animate-bounce animation-delay-[${i * 300}ms]
                `}
                style={{
                  left: `${10 + (i % 4) * 25}%`,
                  top: `${10 + Math.floor(i / 4) * 40}%`,
                  animationDelay: `${i * 300}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* 진행바 (3초 타이머) */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-white/60 transition-all duration-3000 ease-linear"
              style={{ width: showAnimation ? '0%' : '100%' }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
