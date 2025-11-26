// client/src/modules/student/hooks/useStudentFilters.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/constants';

interface Institute {
    _id: string;
    name: string;
    location?: string;
    isActive?: boolean;
}

interface Year {
    _id: string;
    year: number;
}

interface AcademicLevel {
    _id: string;
    name: string;
}

export const useStudentFilters = () => {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [years, setYears] = useState<Year[]>([]);
    const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
    const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(true);
    const [isLoadingYears, setIsLoadingYears] = useState(true);
    const [isLoadingAcademicLevels, setIsLoadingAcademicLevels] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiltersData = async () => {
            const token = Cookies.get('token') || localStorage.getItem('token');
            try {
                const [institutesResponse, yearsResponse] = await Promise.all([
                    axios.get(`${API_URL}/institutes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_URL}/years`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setInstitutes(institutesResponse.data.institutes);
                setYears(yearsResponse.data.years);
                setAcademicLevels([
                    { _id: "OL", name: "Ordinary Level (OL)" },
                    { _id: "AL", name: "Advanced Level (AL)" },
                ]);
            } catch (err) {
                setError('Failed to fetch filter data');
                console.error(err);
            } finally {
                setIsLoadingInstitutes(false);
                setIsLoadingYears(false);
                setIsLoadingAcademicLevels(false);
            }
        };

        fetchFiltersData();
    }, []);

    return { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels, error };
};
