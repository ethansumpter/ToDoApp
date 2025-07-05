"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, X } from "lucide-react";
import { FirstTimeUserFormData, University } from "@/types/user";
import { 
  fetchUniversities, 
  searchUniversities, 
  getUniversityDisplayName 
} from "@/lib/university-utils";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  university: z.string().min(1, {
    message: "Please select a university.",
  }),
  courseSubject: z.string().min(2, {
    message: "Course subject must be at least 2 characters.",
  }),
});

interface FirstTimeUserModalProps {
  open: boolean;
  onSubmit: (data: FirstTimeUserFormData) => Promise<void>;
  isLoading?: boolean;
}

const commonCourseSubjects = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Psychology",
  "History",
  "English Literature",
  "Business Administration",
  "Economics",
  "Engineering",
  "Medicine",
  "Law",
  "Education",
  "Art and Design",
  "Music",
  "Philosophy",
  "Political Science",
  "Sociology",
  "Anthropology",
  "Geography",
  "Environmental Science",
  "Nursing",
  "Pharmacy",
  "Architecture",
  "Accounting",
  "Marketing",
  "Finance",
  "Management",
  "International Relations",
  "Communications",
  "Journalism",
  "Theatre Arts",
  "Film Studies",
  "Sports Science",
  "Agriculture",
  "Other"
];

export function FirstTimeUserModal({ open, onSubmit, isLoading = false }: FirstTimeUserModalProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [universitySearch, setUniversitySearch] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);

  const form = useForm<FirstTimeUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      university: "",
      courseSubject: "",
    },
  });

  useEffect(() => {
    const loadUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const data = await fetchUniversities();
        setUniversities(data);
        setFilteredUniversities(data.slice(0, 50));
      } catch (error) {
        console.error("Failed to load universities:", error);
      } finally {
        setLoadingUniversities(false);
      }
    };

    if (open) {
      loadUniversities();
    }
  }, [open]);

  useEffect(() => {
    if (universities.length > 0) {
      const filtered = searchUniversities(universities, universitySearch);
      setFilteredUniversities(filtered);
    }
  }, [universitySearch, universities]);

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    form.setValue("university", getUniversityDisplayName(university));
    setIsUniversityDropdownOpen(false);
    setUniversitySearch("");
  };

  const handleUniversityInputChange = (value: string) => {
    setUniversitySearch(value);
    setIsUniversityDropdownOpen(true);
    form.setValue("university", value);
    
    if (!value.trim()) {
      setSelectedUniversity(null);
    }
  };

  const clearUniversitySelection = () => {
    setSelectedUniversity(null);
    setUniversitySearch("");
    form.setValue("university", "");
    setIsUniversityDropdownOpen(false);
  };

  const handleSubmit = async (values: FirstTimeUserFormData) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome! Let's set up your profile</DialogTitle>
          <DialogDescription>
            Please provide some additional information to complete your profile.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search for your university..."
                            value={universitySearch || field.value}
                            onChange={(e) => handleUniversityInputChange(e.target.value)}
                            onFocus={() => setIsUniversityDropdownOpen(true)}
                            className="pl-10"
                          />
                        </div>
                        {selectedUniversity && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearUniversitySelection}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {isUniversityDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {loadingUniversities ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm text-gray-500">Loading universities...</span>
                            </div>
                          ) : filteredUniversities.length > 0 ? (
                            filteredUniversities.map((university, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => handleUniversitySelect(university)}
                              >
                                <div className="font-medium">{university.name}</div>
                                <div className="text-gray-500 text-xs">
                                  {university.state_province && `${university.state_province}, `}
                                  {university.country}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No universities found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your course subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {commonCourseSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
