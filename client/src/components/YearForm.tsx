"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar, GraduationCap, Hash } from "lucide-react";
import { InfoDialog } from "@/components/InfoDialog";

interface YearData {

  _id: string;

  year: string;

  name: string;

  isActive: boolean;

}



interface YearFormProps {

  yearData?: YearData | null;

  onSave: (formData: { year: string; name: string }) => void;

  onClose: () => void;

}



export default function YearForm({ yearData, onSave, onClose }: YearFormProps) {



  const [formData, setFormData] = useState({



    year: "",



    name: ""



  });



  const [loading, setLoading] = useState(false);



  const [isInfoOpen, setIsInfoOpen] = useState(false);



  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });







  useEffect(() => {



    if (yearData) {



      setFormData({



        year: yearData.year,



        name: yearData.name



      });



    }



  }, [yearData]);







  const handleSubmit = async (e: React.FormEvent) => {



    e.preventDefault();



    



    if (!formData.year.trim()) {



      setInfoDialogContent({ title: "Validation Error", description: "Please fill in all required fields with valid values" });



      setIsInfoOpen(true);



      return;



    }







    setLoading(true);



    try {



      await onSave({



        year: formData.year,



        name: formData.year



      });



    } catch (error) {



      console.error("Error saving year:", error);



    } finally {



      setLoading(false);



    }



  };







  return (



    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">



      <div className="bg-white rounded-lg w-full max-w-md">



        {/* Header */}



        <div className="flex items-center justify-between p-6 border-b">



          <div className="flex items-center gap-3">



            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">



              <Calendar className="text-green-600" size={20} />



            </div>



            <h2 className="text-xl font-semibold text-gray-900">



              {yearData ? "Edit Academic Year" : "Add New Academic Year"}



            </h2>



          </div>



          <Button variant="ghost" size="icon" onClick={onClose}>



            <X size={20} />



          </Button>



        </div>







        {/* Form */}



        <form onSubmit={handleSubmit} className="p-6 space-y-6">



          {/* Year Number */}



          <div>



            <label className="block text-sm font-medium text-gray-700 mb-2">



              Academic Year *



            </label>



            <div className="relative">



              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />



              <Input



                type="text"



                value={formData.year}



                onChange={(e) => setFormData({ ...formData, year: e.target.value, name: e.target.value })}



                placeholder="e.g., 2024-2025"



                className="pl-10"



                required



              />



            </div>



            <p className="text-xs text-gray-500 mt-1">



              Enter the academic year range (e.g., 2024-2025)



            </p>



          </div>







          {/* Preview */}



          {formData.year && (



            <div className="border-t pt-6">



              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>



              <div className="bg-green-50 rounded-lg p-4 border border-green-200">



                <div className="flex items-center gap-3">



                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">



                    <Calendar className="text-green-600" size={20} />



                  </div>



                  <div>



                    <h4 className="font-semibold text-gray-900">{formData.year}</h4>



                    <p className="text-sm text-gray-600">Academic Year: {formData.year}</p>



                  </div>



                </div>



              </div>



            </div>



          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {yearData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                yearData ? "Update Year" : "Create Year"
              )}
            </Button>
          </div>
        </form>
        <InfoDialog
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          title={infoDialogContent.title}
          description={infoDialogContent.description}
        />
      </div>
    </div>
  );
}
