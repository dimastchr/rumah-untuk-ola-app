import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface Scene4FriendsProps {
  onComplete: () => void;
}

type CharacterId = 'ola' | 'bima' | 'rara';
type FoodId = 'fruits' | 'leaves' | 'figs';

interface Animal {
  id: CharacterId;
  name: string;
  species: string;
  avatar: string;
  favoriteFoodId: FoodId;
  fed: boolean;
  shaking: boolean;
}

interface Food {
  id: FoodId;
  name: string;
  icon: string;
  assignedTo?: CharacterId;
}

export const Scene4Friends: React.FC<Scene4FriendsProps> = ({ onComplete }) => {
  const [animals, setAnimals] = useState<Animal[]>([
    {
      id: 'ola',
      name: 'Ola',
      species: 'Anak Orangutan',
      avatar: '🦧',
      favoriteFoodId: 'fruits',
      fed: false,
      shaking: false,
    },
    {
      id: 'bima',
      name: 'Bima',
      species: 'Bekantan Hidung Panjang',
      avatar: '🐒',
      favoriteFoodId: 'leaves',
      fed: false,
      shaking: false,
    },
    {
      id: 'rara',
      name: 'Rara',
      species: 'Burung Rangkong',
      avatar: '🦜',
      favoriteFoodId: 'figs',
      fed: false,
      shaking: false,
    },
  ]);

  const [foods] = useState<Food[]>([
    { id: 'fruits', name: 'Buah-buahan', icon: '🍌🍎' },
    { id: 'leaves', name: 'Daun Muda', icon: '🌿🌱' },
    { id: 'figs', name: 'Buah Ara', icon: '🫐🍇' },
  ]);

  const [selectedFoodId, setSelectedFoodId] = useState<FoodId | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>(
    'Pilih makanan di bawah, lalu berikan ke hewan yang tepat!'
  );

  const allFed = animals.every((a) => a.fed);

  const handleSelectFood = (foodId: FoodId) => {
    setSelectedFoodId(foodId);
    const food = foods.find((f) => f.id === foodId);
    setFeedbackMsg(`Kamu memilih ${food?.name}. Sekarang ketuk tokoh penerimanya!`);
  };

  const handleFeedAnimal = (animalId: CharacterId) => {
    if (!selectedFoodId) {
      setFeedbackMsg('Pilih salah satu makanan di bawah terlebih dahulu!');
      return;
    }

    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;

    if (animal.fed) {
      setFeedbackMsg(`${animal.name} sudah kenyang dan gembira!`);
      return;
    }

    if (animal.favoriteFoodId === selectedFoodId) {
      // Correct!
      const updatedAnimals = animals.map((a) =>
        a.id === animalId ? { ...a, fed: true } : a
      );
      setAnimals(updatedAnimals);
      setSelectedFoodId(null);

      const willBeAllFed = updatedAnimals.every((a) => a.fed);
      if (willBeAllFed) {
        setFeedbackMsg('Nyam-nyam, terima kasih! Makanan mereka sudah tepat.');
        speechService.speak('Nyam-nyam, terima kasih! Makanan mereka sudah tepat.', {
          rate: 0.95,
          pitch: 1.15,
        });
      } else {
        setFeedbackMsg(`Yummy! ${animal.name} sangat menyukai makanannya.`);
        speechService.speak(`Tepat sekali! ${animal.name} suka makanan ini.`, {
          rate: 1.0,
          pitch: 1.15,
        });
      }
    } else {
      // Wrong! Shake animal, return item, polite voice cue
      setAnimals((prev) =>
        prev.map((a) => (a.id === animalId ? { ...a, shaking: true } : a))
      );
      setTimeout(() => {
        setAnimals((prev) =>
          prev.map((a) => (a.id === animalId ? { ...a, shaking: false } : a))
        );
      }, 800);

      let hint = '';
      if (animalId === 'bima') {
        hint =
          'Ups, Bima si bekantan paling suka makan daun muda. Coba berikan daun muda padanya!';
      } else if (animalId === 'rara') {
        hint =
          'Ups, Rara si rangkong paling suka buah ara di pohon beringin. Coba berikan buah ara padanya!';
      } else {
        hint =
          'Ups, Ola si orangutan paling suka makan aneka buah-buahan hutan yang manis!';
      }

      setFeedbackMsg(hint);
      speechService.speak(hint, { rate: 0.95, pitch: 1.1 });
      setSelectedFoodId(null);
    }
  };

  const handleReset = () => {
    setAnimals((prev) => prev.map((a) => ({ ...a, fed: false, shaking: false })));
    setSelectedFoodId(null);
    setFeedbackMsg('Pilih makanan di bawah, lalu berikan ke hewan yang tepat!');
  };

  return (
    <div className="w-full space-y-4">
      {/* Feeding Arena */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-950/70 via-teal-950/60 to-emerald-950/80 border-2 border-amber-300/80 p-4 sm:p-6 shadow-lg min-h-[360px] flex flex-col justify-between">
        {/* Status header */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-xs sm:text-sm font-black text-emerald-950 border border-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              Misi: Beri makan sahabat hutan ({animals.filter((a) => a.fed).length}/3)
            </span>
          </div>

          {!allFed && animals.some((a) => a.fed) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi</span>
            </button>
          )}
        </div>

        {/* 3 Animal Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-auto z-10 py-3">
          {animals.map((animal) => {
            const isTarget = selectedFoodId !== null && !animal.fed;
            return (
              <div
                key={animal.id}
                onClick={() => handleFeedAnimal(animal.id)}
                className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-between text-center cursor-pointer ${
                  animal.shaking ? 'animate-shake bg-rose-950/80 border-rose-400' : ''
                } ${
                  animal.fed
                    ? 'bg-emerald-900/80 border-emerald-400 shadow-md ring-2 ring-emerald-300/40'
                    : isTarget
                    ? 'bg-white/90 border-amber-400 shadow-xl hover:scale-104 animate-pulse ring-4 ring-amber-300/60'
                    : 'bg-white/80 border-amber-200 hover:bg-white'
                }`}
              >
                <div className="text-4xl sm:text-6xl mb-1 transition-transform">
                  {animal.avatar}
                </div>

                <div>
                  <h3 className="font-display font-black text-sm sm:text-lg text-slate-900 leading-tight">
                    {animal.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-semibold block line-clamp-1">
                    {animal.species}
                  </span>
                </div>

                <div className="mt-2 w-full">
                  {animal.fed ? (
                    <span className="inline-flex items-center justify-center gap-1 text-[11px] font-black text-emerald-100 bg-emerald-800 px-2 py-1 rounded-xl w-full">
                      ✓ Kenyang
                    </span>
                  ) : (
                    <span
                      className={`inline-block text-[10px] sm:text-xs font-black px-2 py-1 rounded-xl w-full ${
                        isTarget
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {selectedFoodId ? 'Ketuk di sini!' : 'Sedang Lapar'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Food Selection Pills */}
        <div className="z-10 bg-white/95 rounded-2xl p-3 border border-amber-300 shadow-md space-y-2">
          <p className="text-xs sm:text-sm font-extrabold text-amber-950 text-center leading-snug">
            {feedbackMsg}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {foods.map((food) => {
              const isSelected = selectedFoodId === food.id;
              // Check if any animal already ate this food
              const isConsumed = animals.some(
                (a) => a.fed && a.favoriteFoodId === food.id
              );

              return (
                <button
                  key={food.id}
                  disabled={isConsumed}
                  onClick={() => handleSelectFood(food.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isConsumed
                      ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed text-slate-400'
                      : isSelected
                      ? 'bg-amber-300 border-amber-500 text-amber-950 shadow-md scale-104 font-black'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-slate-800 hover:scale-102 font-bold active:scale-95'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{food.icon}</span>
                  <span className="text-[11px] sm:text-xs font-extrabold mt-1 text-center">
                    {food.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {allFed && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-black text-emerald-950">
                Luar biasa! Semua sahabat hutan sudah makan dengan kenyang.
              </p>
              <p className="text-xs text-emerald-800">
                Ola mendapat buah-buahan, Bima mendapat daun muda, dan Rara menikmati buah ara.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Lanjut ke Adegan 5</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
