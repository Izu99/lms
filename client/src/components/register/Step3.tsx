import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { MessageCircle, ImagePlus, X, ChevronLeft, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Step3Data {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  address: string;
  telegram: string;
  idCardFront: File | null;
  idCardBack: File | null;
  phoneNumber: string;
  whatsappNumber: string;
  studentType: string;
  institute: string;
}

interface Step3Props {
  data: Step3Data;
  setData: (data: Step3Data) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  studentType: string;
}

export default function Step3({ data, setData, prevStep, handleSubmit, loading, studentType }: Step3Props) {
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, idCardFront: file });
      const url = URL.createObjectURL(file);
      setFrontPreviewUrl(url);
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, idCardBack: file });
      const url = URL.createObjectURL(file);
      setBackPreviewUrl(url);
    }
  };

  const removeImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setData({ ...data, idCardFront: null });
      setFrontPreviewUrl(null);
    } else {
      setData({ ...data, idCardBack: null });
      setBackPreviewUrl(null);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentType === 'Physical' && (!data.idCardFront || !data.idCardBack)) {
      alert("Please upload both front and back of your ID card.");
      return;
    }
    handleSubmit(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Telegram Username */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MessageCircle size={16} className="text-emerald-500" />
            Telegram Username <span className="text-gray-400">(Optional)</span>
          </label>
          <Input
            name="telegram"
            placeholder="Enter your Telegram username"
            value={data.telegram}
            onChange={(e) => setData({ ...data, telegram: e.target.value })}
            className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
          />
        </div>

        {studentType === 'Physical' && (
          <>
            {/* ID Card Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImagePlus size={16} className="text-emerald-500" />
                ID Card Front Image <span className="text-red-500">*</span>
              </label>
              
              {!frontPreviewUrl ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors duration-200">
                  <input
                    type="file"
                    id="idCardImage"
                    accept="image/*"
                    onChange={handleFrontImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="idCardImage"
                    className="cursor-pointer block"
                  >
                    <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <ImagePlus className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium">Click to upload your ID card image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <Image
                      src={frontPreviewUrl}
                      alt="ID Card Preview"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="w-full h-full"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeImage('front')}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full p-0 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* ID Card Back Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImagePlus size={16} className="text-emerald-500" />
                ID Card Back Image <span className="text-red-500">*</span>
              </label>
              
              {!backPreviewUrl ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors duration-200">
                  <input
                    type="file"
                    id="idCardBackImage"
                    accept="image/*"
                    onChange={handleBackImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="idCardBackImage"
                    className="cursor-pointer block"
                  >
                    <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <ImagePlus className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium">Click to upload your ID card back image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <Image
                      src={backPreviewUrl}
                      alt="ID Card Back Preview"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="w-full h-full"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeImage('back')}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full p-0 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm">
              <p className="font-semibold mb-2">Please ensure:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The ID card image is clear and readable</li>
                <li>All corners of the ID card are visible</li>
                <li>The image is not blurry or distorted</li>
                <li>Your student ID number is clearly visible</li>
              </ul>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center w-14 h-14 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                <span>Create Account</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
