'use client';

import React, { useEffect, useState } from 'react';
import Select, { SingleValue, components } from 'react-select';
import { Badge } from '@/shared/ui/badge';
import { getRewardedParticipants } from '@/features/challenge/api/getRewardHistories';
import { Check, X } from 'lucide-react';

export interface Participant {
  id: number;
  username: string;
  email: string;
}

interface SelectOption {
  value: number;
  label: string;
  participant: Participant;
  isRewarded: boolean;
  isDisabled: boolean;
}

interface RewardParticipantSelectorProps {
  challengeId: number;
  participants: Participant[];
  selectedParticipant: Participant | null;
  onSelect: (participant: Participant | null) => void;
  placeholder?: string;
  onRewardedCountChange?: (count: number) => void;
}

// 커스텀 옵션 컴포넌트
  const CustomOption = ({ data, isDisabled }: { data: SelectOption; isDisabled: boolean }) => {
    console.log('🎨 CustomOption 렌더링:', { 
      label: data.label, 
      isRewarded: data.isRewarded, 
      isDisabled,
      dataIsDisabled: data.isDisabled
    });

    return (
      <div 
        className={`flex items-center justify-between p-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
        onClick={() => {
          console.log('🖱️ Option 클릭됨:', { 
            username: data.participant.username, 
            isDisabled: data.isDisabled,
            isRewarded: data.isRewarded 
          });
        }}
      >
        <span className={isDisabled ? 'text-gray-500' : 'text-gray-900'}>
          {data.label}
        </span>
        {data.isRewarded && (
          <span className="text-green-600 font-medium text-sm">완료</span>
        )}
      </div>
    );
  };

export function RewardParticipantSelector({
  challengeId,
  participants,
  selectedParticipant,
  onSelect,
  placeholder = "포상할 인원을 선택하세요",
  onRewardedCountChange
}: RewardParticipantSelectorProps) {
  const [rewardedParticipantIds, setRewardedParticipantIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewardHistories = async () => {
      try {
        setLoading(true);
        console.log('🌐 API 호출 시작: challengeId =', challengeId);
        const response = await getRewardedParticipants(challengeId);
        console.log('✅ API 응답 성공:', response);
        console.log('🎁 포상받은 사람 ID들:', response.rewardedParticipantIds);
        setRewardedParticipantIds(response.rewardedParticipantIds);
      } catch (error) {
        console.error('❌ API 호출 실패:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error details:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardHistories();
  }, [challengeId]);

  const options: SelectOption[] = participants.map(participant => ({
    value: participant.id,
    label: participant.username,
    participant,
    isRewarded: rewardedParticipantIds.includes(participant.id),
    isDisabled: rewardedParticipantIds.includes(participant.id)
  }));

  // 사용 가능한 참여자를 먼저, 이미 포상받은 참여자를 나중에 정렬
  const sortedOptions = [...options].sort((a, b) => {
    if (a.isRewarded !== b.isRewarded) {
      return a.isRewarded ? 1 : -1;
    }
    return a.participant.username.localeCompare(b.participant.username);
  });

  const selectedOption = selectedParticipant ? 
    options.find(opt => opt.value === selectedParticipant.id) : null;

  // 포상받은 참여자 수 계산 및 부모에게 알림
  const rewardedCount = rewardedParticipantIds.length;
  
  useEffect(() => {
    if (onRewardedCountChange && !loading) {
      onRewardedCountChange(rewardedCount);
    }
  }, [rewardedCount, loading, onRewardedCountChange]);

  const customStyles = {
    control: (provided: object, state: {isFocused: boolean}) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    option: (provided: object, state: {isSelected: boolean, isFocused: boolean, isDisabled: boolean}) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
          ? '#f3f4f6' 
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      padding: 0
    }),
    menu: (provided: object) => ({
      ...provided,
      zIndex: 9999
    })
  };

  console.log('Participants:', participants);
  console.log('Options:', options);
  console.log('Sorted Options:', sortedOptions);
  console.log('Rewarded IDs:', rewardedParticipantIds);

  console.log('🔍 RewardParticipantSelector 렌더링됨');
  console.log('📊 참여자 수:', participants.length);
  console.log('🎁 포상받은 사람 ID들:', rewardedParticipantIds);
  console.log('📝 Options 생성됨:', options.map(opt => ({ 
    name: opt.label, 
    isRewarded: opt.isRewarded, 
    isDisabled: opt.isDisabled 
  })));

  if (loading) {
    return (
      <div className="w-full p-3 text-center text-sm text-gray-500 border rounded-md">
        포상 이력을 확인하는 중...
      </div>
    );
  }

  // React Select 버전 - 단계별 적용
  return (
    <div>
      <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
        🔧 컴포넌트: RewardParticipantSelector (React Select 사용 중)
        <br />
        📊 전체: {participants.length}명 | 포상완료: {rewardedCount}명 | 선택가능: {participants.length - rewardedCount}명
      </div>
            <Select<SelectOption>
        options={sortedOptions}
        value={selectedOption}
        onChange={(newValue: SingleValue<SelectOption>) => {
          console.log('🎯 React Select onChange 호출됨:');
          console.log('  - newValue:', newValue);
          console.log('  - isDisabled:', newValue?.isDisabled);
          console.log('  - participant:', newValue?.participant);
          
          if (newValue && !newValue.isDisabled) {
            console.log('✅ 선택 처리됨:', newValue.participant.username);
            onSelect(newValue.participant);
          } else {
            console.log('❌ 선택 취소 또는 비활성화됨');
            onSelect(null);
          }
        }}
        components={{
          Option: (props) => {
            const { data } = props;
            return (
              <components.Option {...props}>
                <div className="flex items-center justify-between w-full">
                  <span>{data.label}</span>
                  {data.isRewarded && (
                    <span className="text-green-600 font-medium text-sm">완료</span>
                  )}
                </div>
              </components.Option>
            );
          }
        }}
        placeholder={placeholder}
        isClearable
        isOptionDisabled={(option) => option.isDisabled}
        classNamePrefix="reward-select"
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '38px'
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999
          })
        }}
      />
    </div>
  );
}