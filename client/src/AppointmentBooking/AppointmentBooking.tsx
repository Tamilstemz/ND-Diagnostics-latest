import React, { useState, useRef, useEffect } from "react";
import { environment } from "../../../environment/environment";
import httpClient from "../../../api/httpClient";
import { array, string } from "zod";
import Calendar from "react-calendar"; // for basic calendar
import FullCalendar from "@fullcalendar/react"; // for full-featured calendar
import "./AppointmentBooking.css";
import dummyqr from "../../assests/dummyqr.jpg";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "material-react-toastify";
import { showToast } from "../components/ToastContainer/Toast";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  id: number;
  name: string;
  code: string;
  price: string; // from your API, price is a string
};
type Slot = {
  // define relevant fields based on your API
  id: number;
  slot: {
    date: string;
    remaining: number;
    [key: string]: any;
  };
  [key: string]: any;
};

type TimeSlot = {
  id: number;
  slot: {
    id: number;
    center: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
      city: {
        id: number;
        name: string;
      };
      state: number;
      timezone: string;
      code: string;
    };
    date: string;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    created_by: number;
    modified_by: number | null;
    application: number;
    depart_detail: {
      id: number;
      name: string;
      code: string;
    }[];
    slottime: {
      start_time: string;
      end_time: string;
      available: number;
      remaining: number;
    }[];
    available: number;
    remaining: number;
  };
  department: {
    id: number;
    name: string;
    code: string;
    description: string | null;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    application: number;
    created_by: number;
    modified_by: number | null;
  };
  start_time: string;
  end_time: string;
  available: number;
  remaining: number;
  status: number;
  department_name: string;
  department_details: {
    department__name: string;
    department__id: number;
  }[];
  department_status: number;

  // These two are not in the sample data, so optional
  time?: string;
  booked?: boolean;
};
type SimpleSlot = {
  time: string;
  available: boolean;
  booked: boolean;
};

type SlotsDataMap = {
  [date: string]: SimpleSlot[];
};

type UpcomingDateSlot = {
  date: Date;
  slots: any[]; // Replace `any[]` with a specific type if you know the slot structure
};

type CalendarEvent = {
  date: string; // Example: "2025-06-14"
  timeSlot: string; // Example: "12:00 PM to 01:00 PM"
};

type FormDataType = {
  patientName: string;
  hapId: string;
  email: string;
  contactNumber: string;
  alternativeNumber: string;
  gender: string;
  age: string;
  visaCategory: string;
  passportNo: string;
  paymentPreference: string;
  paymentMethod: string;
  dob: string;
  TransactionId: string;
  servicecode: string[]; // ← Explicitly typed as string[]
  totalPrice: number;
};

const AppointmentBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(selectedDate);

  const [viewMode, setViewMode] = useState("month");
  const [center, setcenter] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog1, setShowDialog1] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [appointmentType, setAppointmentType] = useState("Self");
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [upcomingDatesWithSlots, setUpcomingDatesWithSlots] = useState<
    UpcomingDateSlot[]
  >([]);
  const nextFourNonSundays: string[] = [];

  const [Slots1, setSlots1] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingType, setbookingType] = useState("self");
  const [slotsData, setSlotsData] = useState<SlotsDataMap>({});
  const calendarSlotMap: { [key: string]: any[] } = {};
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  console.log(timeSlots);
  const [membercount, setmembercount] = useState(0);
  const [bookedEvents, setBookedEvents] = useState<CalendarEvent[]>([]);
  const [dotDates, setDotDates] = useState<Set<string>>(new Set());
  const [slotsGroupedByDate, setSlotsGroupedByDate] = useState<
    Record<string, any[]>
  >({});
  const [stepIndex, setStepIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedslottime, setselectedslottime] = useState("");
  const [invoiceUrls, setinvoiceUrls] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    patientName: "",
    hapId: "",
    email: "",
    contactNumber: "",
    alternativeNumber: "",
    gender: "",
    age: "",
    visaCategory: "",
    passportNo: "",
    paymentPreference: "",
    paymentMethod: "",
    dob: "",
    TransactionId: "",
    servicecode: [],
    totalPrice: 0,
  });
  const [members, setMembers] = useState<any[]>([
    {
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "",
      dob: "",
      TransactionId: "",
      servicecode: [],
      totalPrice: 0,
      slot_booking: [],
    },
  ]);

  console.log(formData);

  useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "auto"; // Restore scroll
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDialog]);

  const getMonthName = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const isCurrentMonth = (date: any) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: any) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isServiceSelected = (code: any) => selectedServices.includes(code);
  const formatDateToYYYYMMDD = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const hasEvent = (day: Date) => {
    const dateStr = formatDateToYYYYMMDD(day);
    return dotDates.has(dateStr);
  };

  const isTimeSlotBooked = (date: Date, timeSlot: string): boolean => {
    const dateStr = formatDateToYYYYMMDD(date);

    return bookedEvents.some(
      (event) => event.date === dateStr && event.timeSlot === timeSlot
    );
  };

  const selectDate = (date: any) => {
    setSelectedDate(date);
    setSlots1([]);

    setUpcomingDatesWithSlots([]);

    for (let i = 0; i < 4; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + i);

      const dateStr = formatDateToYYYYMMDD(day);
      const slots = slotsData[dateStr] || [];

      const enrichedSlots = slots.map((slot) => ({
        ...slot,
        booked: isTimeSlotBooked(day, slot.time),
        date: day,
      }));

      upcomingDatesWithSlots.push({
        date: new Date(day),
        slots: enrichedSlots,
      });
    }
  };

  const goToPrevious = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNext = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const bookTimeSlot = (slot: any) => {
    if (selectedServices.length === 0) {
      showToast("warning", "Select Service");
      return;
    }

    if (!slot.available) return;
    const slotDateStr = slot.slotItem.slot.date; // "YYYY-MM-DD"
    const slotDateObj = new Date(slotDateStr);
    setSelectedDate(slotDateObj); // ✅ Update selected date on slot click

    const slotData = {
      action_date: formatDateToDDMMYYYY(selectedDate),
      booked_time: slot.time,
      booking_from: 3,
      booking_status: 1,
      date_booked: formatDateToYYYYMMDDNew(new Date()),
      department: "AU",
      description: "Test Service",
      service_code: formData.servicecode,
    };

    setselectedslottime(slot.time);
    setSelectedSlot(slot.slotItem);
    setShowDialog(true);

    // Update only if it's a group appointment
    if (appointmentType === "Group") {
      const updatedMembers = members.map((member) => ({
        ...member,
        slot_booking: [...member.slot_booking, slotData],
      }));
      setMembers(updatedMembers);
    }
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedSlot(null);
  };

  const scheduleAppointment = () => {
    console.log("Scheduling appointment:", {
      ...formData,
      slot: selectedSlot,
      date: selectedDate,
    });
    closeDialog();
  };

  const convertTo12HourFormat = (time24: string): string => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // Converts 0 -> 12 for midnight
    const hourFormatted = hour.toString().padStart(2, "0");

    return `${hourFormatted}:${minute} ${ampm}`;
  };

  const parseTimeSlotsFromData = (data: any[]) => {
    console.log("Slot data:", data);

    const parsedSlots: {
      [key: string]: { time: string; available: boolean; booked: boolean }[];
    } = {};

    data.forEach((entry) => {
      const dateStr = entry.slot.date;
      const slotInfos = entry.slot.slottime;

      if (!parsedSlots[dateStr]) {
        parsedSlots[dateStr] = [];
      }

      const existingTimes = new Set(
        parsedSlots[dateStr].map((slot) => slot.time)
      );

      slotInfos.forEach((timeSlot: any) => {
        const startTime12 = convertTo12HourFormat(
          timeSlot.start_time.slice(0, 5)
        );
        const endTime12 = convertTo12HourFormat(timeSlot.end_time.slice(0, 5));
        const formattedTime = `${startTime12} to ${endTime12}`;

        if (!existingTimes.has(formattedTime)) {
          parsedSlots[dateStr].push({
            time: formattedTime,
            available: timeSlot.available > 0,
            booked: false,
          });
          existingTimes.add(formattedTime);
        }
      });
    });

    // ✅ Update state
    setSlotsData(parsedSlots);
  };

  const processSlots = (data: any) => {
    data.forEach((entry: any) => {
      const date = entry.slot.date;
      if (!calendarSlotMap[date]) {
        calendarSlotMap[date] = [];
      }
      calendarSlotMap[date].push(entry);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(environment.AVAILABLE_CENTER_API);
        console.log(res.data.data);

        setcenter(res.data.data || []);
      } catch (err) {
        console.error("Error loading slots", err);
      }
    })();
  }, []);
  const handleCenterChange = async (event: any) => {
    const selectedCode = event.target.value;
    setSelectedCenter(selectedCode);
    setUpcomingDatesWithSlots([]);
    setFormData({
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "",
      dob: "",
      TransactionId: "",
      servicecode: [],
      totalPrice: 0,
    });
    setMembers([
      {
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "",
        dob: "",
        TransactionId: "",
        servicecode: [],
        totalPrice: 0,
        slot_booking: [],
      },
    ]);
    setSelectedServices([]);
    setUpcomingDatesWithSlots([]);
    setSelectedDate(null);
    setselectedslottime("");
    setServiceList([]);

    const selectedCenter = center.find(
      (center: any) => center.code === selectedCode
    );

    // Step 1: Get Services
    try {
      const serviceApiUrl = `${environment.AVAILABLE_SERVIVCE_API}&center=${selectedCode}`;
      const res = await httpClient.get(serviceApiUrl);
      setServiceList(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    // Step 2: Get Slots
    try {
      const formData = new FormData();
      formData.append("application", "1");
      formData.append("center", selectedCode);

      const res = await httpClient.post(
        environment.AVAILABLE_SLOTS_API,
        formData
      );
      const Timeslot = res.data.data || [];

      // ✅ Update state
      setTimeSlots(Timeslot);

      // ✅ Green Dot Dates
      const slotDates = Timeslot.map((item: any) =>
        formatDateToYYYYMMDD(new Date(item.slot.date))
      );
      setDotDates(new Set(slotDates));

      // ✅ Initialize slot view directly (fix mismatch)
      const today = new Date();
      setSelectedDate(today);
      handleDateClick(today, Timeslot); // ✅ use fresh Timeslot
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (code: any) => selectedServices.includes(code);

  const isSelecteddate = (date: Date) =>
    selectedDate && date.toDateString() === selectedDate.toDateString();

  const isAllSelected = () => selectedServices.length === serviceList.length;

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCodes = serviceList.map((s) => s.code);
      const totalPrice = serviceList.reduce(
        (sum, s) => sum + parseFloat(s.price),
        0
      );

      setFormData((prev) => ({
        ...prev,
        servicecode: allCodes,
        totalPrice: totalPrice,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        servicecode: [],
        totalPrice: 0,
      }));
    }
  };

  console.log(selectedServices);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    code: string,
    price: any
  ) => {
    let updatedSelected: string[];

    if (e.target.checked) {
      updatedSelected = Array.from(new Set([...selectedServices, code]));
    } else {
      updatedSelected = selectedServices.filter((c) => c !== code);
    }
    console.log(updatedSelected);

    setSelectedServices(updatedSelected);
    console.log(appointmentType);

    // Update all members if appointment type is Group
    if (appointmentType === "Group") {
      const updatedMembers = members.map((member) => ({
        ...member,
        servicecode: updatedSelected,
        totalPrice: updatedSelected.length * price, // each service has the same price
      }));
      setMembers(updatedMembers);
    } else {
      updateFormDataWithServices(updatedSelected);
    }
    console.log(members);
  };

  const updateFormDataWithServices = (selectedCodes: string[]) => {
    const uniqueCodes = Array.from(new Set(selectedCodes));

    const total = serviceList
      .filter((s) => uniqueCodes.includes(s.code))
      .reduce((sum, s) => sum + parseFloat(s.price), 0);

    setFormData((prev) => ({
      ...prev,
      servicecode: uniqueCodes,
      totalPrice: total,
    }));
  };

  const getSelectedServiceNames = () => {
    return serviceList
      .filter((s: any) => selectedServices.includes(s.code))
      .map((s) => s.name)
      .join(", ");
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    return date < today;
  };

  const formatTo12Hour = (time24: string): string => {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const handleDateClick = (day: Date, rawSlots: any[]) => {
    if (isPastDate(day)) return;

    setSelectedDate(day);

    const selectedDates: string[] = [];
    const selectedDateStringsSet = new Set<string>();

    for (let i = 0; i < 4; i++) {
      const newDate = new Date(day.getTime());
      newDate.setDate(day.getDate() + i);
      const dateStr = formatDateToYYYYMMDD(newDate);
      selectedDates.push(dateStr);
      selectedDateStringsSet.add(dateStr);
    }

    const grouped: Record<string, any[]> = {};
    selectedDates.forEach((date) => {
      grouped[date] = [];
    });

    const filteredSlotData = rawSlots.filter((slotItem: any) =>
      selectedDateStringsSet.has(slotItem.slot.date)
    );

    for (const slotItem of filteredSlotData) {
      const slotDate = slotItem.slot.date;

      for (const time of slotItem.slot.slottime) {
        grouped[slotDate].push({
          time: `${formatTo12Hour(time.start_time)} to ${formatTo12Hour(
            time.end_time
          )}`,
          available: time.available,
          remaining: time.remaining,
          slotItem,
        });
      }
    }

    setSlotsGroupedByDate(grouped);
  };

  // Format date to yyyy-mm-dd
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Calculate age from dob
  const calculateAge = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Calculate dob from age (returns yyyy-01-01)
  const calculateDOB = (age: string): string => {
    const birthYear = new Date().getFullYear() - parseInt(age, 10);
    return `${birthYear}-01-01`;
  };

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number // optional index for group members
  ) => {
    const { name, value } = e.target;

    if (appointmentType === "Self") {
      let updatedData = { ...formData, [name]: value };

      // If DOB is updated, auto-calculate age
      if (name === "dob" && value) {
        updatedData.age = calculateAge(value);
      }

      // If Age is updated, set DOB to 01-01-YYYY
      if (name === "age" && /^\d+$/.test(value)) {
        updatedData.dob = calculateDOB(value);
      }

      if (name === "hapId" && !/^\d{8}$/.test(value)) {
        updatedData.hapId = value;
      }

      setFormData(updatedData);

      // Clear error if present
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    } else if (appointmentType === "Group" && typeof index === "number") {
      const updatedMembers = [...members];
      updatedMembers[index][name] = value;

      // Handle DOB and Age logic for group
      if (name === "dob" && value) {
        updatedMembers[index].age = calculateAge(value);
      }

      if (name === "age" && /^\d+$/.test(value)) {
        updatedMembers[index].dob = calculateDOB(value);
      }

      setMembers(updatedMembers);
    }

    console.log(members);
  };

  const getYesterdayDate = (): string => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Move back one day
    return today.toISOString().split("T")[0];
  };

  const nextStep = () => {
    const errors: { [key: string]: string } = {};

    if (appointmentType === "Group") {
      let hasError = false;

      members.forEach((member, index) => {
        const {
          patientName,
          email,
          contactNumber,
          alternativeNumber,
          age,
          dob,
          passportNo,
          gender,
        } = member;

        if (!patientName.trim()) {
          errors[`patientName_${index}`] = "Applicant Name is required.";
          hasError = true;
        }

        // if (!contactNumber.trim()) {
        //   errors[`contactNumber_${index}`] = "Contact Number is required.";
        //   hasError = true;
        // } else if (!/^\d{10}$/.test(contactNumber)) {
        //   errors[`contactNumber_${index}`] = "Must be exactly 10 digits.";
        //   hasError = true;
        // }

        if (!dob) {
          errors[`dob_${index}`] = "Date of Birth is required.";
          hasError = true;
        }

        if (!age.trim()) {
          errors[`age_${index}`] = "Age is required.";
          hasError = true;
        }

        if (!passportNo.trim()) {
          errors[`passportNo_${index}`] = "Passport Number is required.";
          hasError = true;
        } else if (!/^[A-Z0-9]{6,9}$/.test(passportNo)) {
          errors[`passportNo_${index}`] =
            "6-9 characters, uppercase letters/numbers only.";
          hasError = true;
        }

        // if (alternativeNumber && !/^\d{10}$/.test(alternativeNumber)) {
        //   errors[`alternativeNumber_${index}`] = "Must be exactly 10 digits.";
        //   hasError = true;
        // }

        // if (!email.trim()) {
        //   errors[`email_${index}`] = "Email is required.";
        //   hasError = true;
        // } else if (!/^[^\s@]+@[^\s@]+\.(com|net|org|io|in)$/.test(email)) {
        //   errors[`email_${index}`] =
        //     "Enter a valid email (e.g., name@example.com)";
        //   hasError = true;
        // }

        if (!gender.trim()) {
          errors[`gender_${index}`] = "Gender is required.";
          hasError = true;
        }
      });

      setFormErrors(errors);

      if (!hasError && stepIndex < 1) {
        setStepIndex(stepIndex + 1);
      }
    } else if (appointmentType === "Self") {
      const {
        patientName,
        email,
        contactNumber,
        alternativeNumber,
        age,
        dob,
        passportNo,
        gender,
        hapId,
      } = formData;

      if (!patientName.trim())
        errors.patientName = "Applicant Name is required.";
      if (!contactNumber.trim())
        errors.contactNumber = "Contact Number is required.";
      else if (!/^\d{10}$/.test(contactNumber))
        errors.contactNumber = "Must be exactly 10 digits.";
      else if (!/^\d{8}$/.test(hapId))
        errors.hapId = "Must be exactly 8 digits.";

      if (!dob) errors.dob = "Date of Birth is required.";

      if (!age.trim()) errors.age = "Age is required.";

      if (!passportNo.trim())
        errors.passportNo = "Passport Number is required.";
      else if (!/^[A-Z0-9]{6,12}$/.test(passportNo))
        errors.passportNo = "6-9 characters, uppercase letters/numbers only.";

      if (alternativeNumber && !/^\d{10}$/.test(alternativeNumber))
        errors.alternativeNumber = "Must be exactly 10 digits.";

      if (!email.trim()) errors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
        errors.email = "Enter a valid email (e.g., name@example.com)";

      if (!gender.trim()) errors.gender = "Gender is required.";

      setFormErrors(errors);

      if (Object.keys(errors).length === 0 && stepIndex < 1) {
        setStepIndex(stepIndex + 1);
      }
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };
  const formatDateToDDMMYYYY = (date: string | Date | null): string => {
    if (!date) return "No date selected";

    const d = typeof date === "string" ? new Date(date) : date;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDateToYYYYMMDDNew = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const appointmentTypechnage = (e: any, type: string) => {
    setAppointmentType(type);
    if (type === "Group") {
      setSlotsGroupedByDate({});
    }
  };

  const handleMemberCountChange = (e: any) => {
    const count = parseInt(e.target.value, 10);
    setmembercount(count);
    console.log(members);

    const servicedetail = members[0]?.servicecode;
    console.log(servicedetail);

    const updatedMembers = Array.from({ length: count }, (_, i) => ({
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "",
      dob: "",
      TransactionId: "",
      servicecode: servicedetail,
      totalPrice: 0,
      slot_booking: [],
    }));

    setMembers(updatedMembers);
  };
  const clear = () => {
    // Clear only personal details in formData
    setFormData((prev) => ({
      ...prev,
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "",
      dob: "",
      TransactionId: "",
      // Keep servicecode and totalPrice
    }));

    // Clear only personal details in members (assumes 1 member initially)
    setMembers((prevMembers) =>
      prevMembers.map((member) => ({
        ...member,
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "",
        dob: "",
        TransactionId: "",
        // Keep servicecode, slot_booking, totalPrice
      }))
    );
  };

  const onSubmit = async () => {
    try {
      if (!selectedDate || !selectedSlot) {
        toast.error("Please select a date and slot before submitting.");
        return;
      }

      let finalData;

      if (appointmentType === "Group") {
        finalData = members.map((member, index) => ({
          type: "I",
          applicant_number: "", // Can be filled if you have logic
          fullname: member.patientName,
          email: member.email,
          contact_number: member.contactNumber,
          alt_number: member.alternativeNumber,
          hap_id: member.hapId,
          relationship: index === 0 ? "Self" : "Family",
          reference_applicant_number: "",
          passport_number: member.passportNo,
          dob: formatDateToDDMMYYYY(member.dob),
          gender: member.gender,
          address: "123 Street, City",
          transaction_id: "3928564386583",
          payment_method: member.paymentMethod,
          transaction_amt: member.totalPrice,
          status: 1,
          created_by: 1,
          slot_booking: member.slot_booking.map((slot: any) => ({
            ...slot,
            servicecode: selectedService,
            action_date: formatDateToYYYYMMDDNew(new Date()),
            date_booked: formatDateToYYYYMMDDNew(selectedDate),
          })),
        }));
      } else {
        finalData = [
          {
            type: "I",
            applicant_number: "",
            fullname: formData.patientName,
            email: formData.email,
            contact_number: formData.contactNumber,
            alt_number: formData.alternativeNumber,
            hap_id: formData.hapId,
            relationship: "Self",
            reference_applicant_number: "",
            passport_number: formData.passportNo,
            dob: formatDateToDDMMYYYY(formData.dob),
            gender: formData.gender,
            address: "123 Street, City",
            transaction_id: formData.TransactionId,
            payment_method: formData.paymentMethod,
            transaction_amt: formData.totalPrice,
            status: 1,
            created_by: 1,
            slot_booking: [
              {
                action_date: formatDateToYYYYMMDDNew(new Date()),
                date_booked: formatDateToYYYYMMDDNew(selectedDate),

                booked_time: selectedslottime,
                booking_from: 3,
                booking_status: 1,

                department: "AU",
                description: "Test Service",
                service_code: formData.servicecode,
              },
            ],
          },
        ];
      }

      console.log(selectedServices);

      console.log(finalData);

      const res = await httpClient.post(
        environment.APPLICANT_WITH_APPT_API,
        finalData
      );

      const responseData = res.data.data;
      console.log("responseData :", responseData);
      const invoiceUrls1: any[] = [];
      const allSuccessful = responseData.every((applicant: any) => {
        const appointments = applicant?.appointments;
        const booking = appointments?.bookings?.[0];

        if (
          appointments?.status === "success" &&
          appointments.errors?.length === 0 &&
          booking?.appointment_id
        ) {
          const appointmentId = booking.appointment_id;
          invoiceUrls1.push(
            `https://ndhealthcheck.com/appointment-service/transaction/invoice/pdf/${appointmentId}`
          );
          return true;
        }

        return false;
      });
      setinvoiceUrls(invoiceUrls1);
      if (allSuccessful) {
        const firstBooking = responseData[0]?.appointments?.bookings?.[0];
        const applicantNumber = responseData[0]?.applicant_number;
        const bookedDate = firstBooking?.date;
        const bookedTime = firstBooking?.time;

        const message = `✅ Applicant ${applicantNumber} booked on ${bookedDate} at ${bookedTime}`;
        console.log(message);
        showToast("success", message);
        setShowDialog(false);
        setFormData({
          patientName: "",
          hapId: "",
          email: "",
          contactNumber: "",
          alternativeNumber: "",
          gender: "",
          age: "",
          visaCategory: "",
          passportNo: "",
          paymentPreference: "",
          paymentMethod: "",
          dob: "",
          TransactionId: "",
          servicecode: [],
          totalPrice: 0,
        });
        setMembers([
          {
            patientName: "",
            hapId: "",
            email: "",
            contactNumber: "",
            alternativeNumber: "",
            gender: "",
            age: "",
            visaCategory: "",
            passportNo: "",
            paymentPreference: "",
            paymentMethod: "",
            dob: "",
            TransactionId: "",
            servicecode: [],
            totalPrice: 0,
            slot_booking: [],
          },
        ]);
        setSelectedCenter("");
        setSelectedService("");
        setUpcomingDatesWithSlots([]);
        setSelectedDate(null);
        setselectedslottime("");
      } else {
        toast.error("Some applicant bookings failed.");
      }

      // ✅ You can now use `invoiceUrls` wherever needed
      console.log("Invoice URLs:", invoiceUrls);

      setShowDialog1(true);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  const cancel = () => {
    setShowDialog(false);
    setFormData({
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "",
      dob: "",
      TransactionId: "",
      servicecode: [],
      totalPrice: 0,
    });
    setMembers([
      {
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "",
        dob: "",
        TransactionId: "",
        servicecode: [],
        totalPrice: 0,
        slot_booking: [],
      },
    ]);
  };

  const cancel1 = () => {
    setShowDialog1(false);
  };

  const getDynamicPlaceholder = (field: string): string => {
    switch (field) {
      case "passportNo":
        return formErrors.passportNo
          ? "Format: A123456 or AB1234567"
          : "e.g. A123456";
      case "email":
        return formErrors.email
          ? "Format: name@example.com"
          : "e.g. john@example.com";
      case "contactNumber":
        return formErrors.contactNumber
          ? "10-digit mobile number"
          : "e.g. 9876543210";

      case "alternativeNumber":
        return formErrors.alternativeNumber
          ? "10-digit Alternate number"
          : "e.g. 9876543210";

      case "hapId":
        return formErrors.hapId ? "8- digit" : "e.g. 9876543210";
      default:
        return "";
    }
  };

  return (
    <div className="container-fluid p-3" style={{ marginTop: "10px" }}>
      <div
        className="row"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        {/* Calendar Section */}
        <div className="col-lg-5 col-md-6 mb-4">
          <div
            className="card border"
            style={{ borderColor: "#dee2e6", borderRadius: "8px" }}
          >
            <div className="card-header bg-white border-0">
              <div className="d-flex justify-content-between align-items-center py-3">
                <h4
                  className="mb-0 text-dark fw-normal"
                  style={{ fontSize: "20px" }}
                >
                  {getMonthName()}
                </h4>
                <div className="d-flex gap-2">
                  <button
                    className="btn text-white d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e67e22",
                      width: "40px",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                    }}
                    onClick={goToPrevious}
                  >
                    ‹
                  </button>
                  <button
                    className="btn text-white px-4"
                    style={{
                      backgroundColor: "#e67e22",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    onClick={goToToday}
                  >
                    Today
                  </button>
                  <button
                    className="btn text-white d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e67e22",
                      width: "40px",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                    }}
                    onClick={goToNext}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card-body p-4"
              style={{ backgroundColor: "#f8f9fa", minHeight: "450px" }}
            >
              {/* Weekday Headers */}
              <div className="d-flex mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="flex-fill text-center">
                      <div
                        className="fw-semibold text-dark"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {day}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="calendar-wrapper">
                <div
                  className={`calendar-grid ${selectedCenter ? "active" : ""}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                    height: "350px",
                    position: "relative",
                    opacity: !selectedCenter ? 0.5 : 1,
                    pointerEvents: !selectedCenter ? "none" : "auto",
                    cursor: !selectedCenter ? "not-allowed" : "pointer",
                  }}
                >
                  {getCalendarDays().map((day, index) => {
                    const isSunday = day.getDay() === 0;
                    const past = isPastDate(day) || isSunday;
                    const today = isToday(day);
                    const selected = isSelected(day);
                    const hasSlot = hasEvent(day);
                    const currentMonth = isCurrentMonth(day);

                    const isDisabled = past || !currentMonth || !selectedCenter;

                    const dayStyle: React.CSSProperties = {
                      width: "35px",
                      height: "35px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: !currentMonth
                        ? "#ccc"
                        : past
                        ? "#888"
                        : today || selected
                        ? "white"
                        : "black",
                      border: isDisabled ? "1px solid #ccc" : "none",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      backgroundColor: today
                        ? "#e67e22"
                        : selected
                        ? "#007bff"
                        : "transparent",
                      position: "relative",
                      opacity: isDisabled ? 0.5 : 1,
                    };

                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-center position-relative"
                        style={{
                          height: "35px",
                          fontSize: "16px",
                          fontWeight: "400",
                          pointerEvents: isDisabled ? "none" : "auto",
                        }}
                        onClick={() => {
                          if (!isDisabled) {
                            handleDateClick(day, timeSlots);
                          }
                        }}
                      >
                        <div
                          className={`d-flex align-items-center justify-content-center rounded-circle position-relative ${
                            !isDisabled ? "calendar-day" : ""
                          } ${isSelecteddate(day) ? "selected" : ""}`}
                          style={dayStyle}
                        >
                          {day.getDate()}
                          {hasSlot && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "4px",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "#28a745",
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!selectedCenter && (
                  <div className="calendar-tooltip">
                    Please choose a center to enable calendar
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Slots Panel */}
        </div>

        {/* Service Selection Section */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="col g-4 mb-4" style={{ display: "flex" }}>
                <div
                  className="col-md-6"
                  style={{ display: "flex", gap: "15px" }}
                >
                  <label
                    style={{
                      display: "flex",
                      width: "180px",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className="form-label"
                  >
                    Select Center <span>:</span>
                  </label>
                  <select
                    style={{
                      width: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      padding: "6px 10px",
                      border: "1px solid lightgrey",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxSizing: "border-box",
                    }}
                    value={selectedCenter}
                    onChange={handleCenterChange}
                  >
                    <option value="">Select</option>
                    {Array.isArray(center) &&
                      center.map((item: any, index: number) => (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div
                  className="col-md-6"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <label
                    style={{
                      width: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginLeft: "5px",
                    }}
                  >
                    Select Service <span>:</span>
                  </label>

                  <div
                    style={{ position: "relative", width: "18rem" }}
                    ref={dropdownRef}
                  >
                    {/* Trigger */}
                    <div
                      style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "6px 10px",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                      }}
                      onClick={toggleDropdown}
                    >
                      {getSelectedServiceNames() || "Select Service"}
                      <span>&#9662;</span>
                    </div>

                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          backgroundColor: "white",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                          border: "1px solid lightgray",
                          borderRadius: "5px",
                          maxHeight: "300px",
                          overflowY: "auto",
                          boxSizing: "border-box",
                          zIndex: 999,
                        }}
                      >
                        {selectedCenter && serviceList.length > 0 && (
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "10px",
                              padding: "5px",
                            }}
                          >
                            <input
                              type="checkbox"
                              // disabled={bookingType === "family"}
                              checked={isAllSelected()}
                              onChange={toggleSelectAll}
                            />
                            Select All
                          </label>
                        )}

                        {selectedCenter && serviceList.length === 0 && (
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "10px",
                              padding: "5px",
                            }}
                          >
                            <span style={{ color: "gray" }}>
                              No Service Available for selected Center
                            </span>
                          </label>
                        )}

                        {serviceList.map(
                          (service) =>
                            selectedCenter && (
                              <label
                                key={service.code}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  gap: "10px",
                                  padding: "5px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  // disabled={bookingType === "family"}
                                  checked={selectedServices.includes(
                                    service.code
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      service.code,
                                      service.price
                                    )
                                  }
                                />
                                <span>{service.name}</span>
                              </label>
                            )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="mb-3"
                style={{ display: "flex", gap: "10px", fontSize: "16px" }}
              >
                <div className="form-check formData-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="appointmentType"
                    id="self"
                    value="Self"
                    checked={appointmentType === "Self"}
                    onChange={(e) =>
                      appointmentTypechnage(e.target.value, "Self")
                    }
                  />
                  <label className="form-check-label" htmlFor="self">
                    Self
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="appointmentType"
                    id="group"
                    value="Group"
                    checked={appointmentType === "Group"}
                    onChange={(e) =>
                      appointmentTypechnage(e.target.value, "Group")
                    }
                  />
                  <label className="form-check-label" htmlFor="group">
                    Group
                  </label>
                </div>
              </div>
              {appointmentType === "Group" && (
                <form>
                  {appointmentType === "Group" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "20%",
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Member's Count<span>:</span>
                      </label>
                      {/* <select>
                        <option value={1}>1</option>
                      </select> */}
                      <input
                        style={{ width: "120px" }}
                        type="number"
                        value={membercount}
                        onChange={handleMemberCountChange}
                        min={1}
                        className="form-control"
                      />
                    </div>
                  )}
                </form>
              )}
            </div>

            {selectedDate && selectedCenter && (
              <div
                key={selectedDate.toString()}
                className="card shadow-sm mt-3 slot-slide-in position-relative"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* 🔴 Overlay if no service selected */}
                {selectedServices.length === 0 && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      zIndex: 10,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    Please choose a service to book a slot
                  </div>
                )}

                {/* 🎯 Actual Slot Content */}
                <div className="card-body">
                  {(() => {
                    const selected = new Date(selectedDate);
                    const sortedSlotDates = Object.keys(slotsGroupedByDate)
                      .map((d) => new Date(d))
                      .filter((d) => d >= selected && d.getDay() !== 0)
                      .sort((a, b) => a.getTime() - b.getTime())
                      .slice(0, 4);

                    return sortedSlotDates.map((date) => {
                      const dateKey = Object.keys(slotsGroupedByDate).find(
                        (key) =>
                          new Date(key).toDateString() === date.toDateString()
                      );
                      const slots = dateKey ? slotsGroupedByDate[dateKey] : [];

                      return (
                        <div
                          key={dateKey}
                          className="mb-3"
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: "column",
                            border: "1px solid lightgrey",
                          }}
                        >
                          <div
                            className="card-header bg-blue"
                            style={{ fontSize: "15px" }}
                          >
                            <h5 className="mb-0">
                              Available Slots from{" "}
                              {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </h5>
                          </div>

                          {slots.length > 0 ? (
                            <div
                              className="row g-2"
                              style={{ padding: "10px" }}
                            >
                              {slots.map((slot: any, idx: number) => (
                                <div key={idx} className="col-6 col-md-4">
                                  <button
                                    className={`btn w-100 ${
                                      slot.remaining > 0
                                        ? "btn-outline-primary"
                                        : "btn-outline-secondary disabled"
                                    }`}
                                    onClick={() => bookTimeSlot(slot)}
                                    disabled={
                                      slot.remaining <= 0 ||
                                      selectedServices.length === 0
                                    }
                                  >
                                    {slot.time}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              className="text-muted fst-italic"
                              style={{ padding: "10px" }}
                            >
                              No slots for this date
                            </p>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showDialog && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h1
                  style={{ fontSize: "30px", fontWeight: "bold" }}
                  className="modal-title w-100 text-center"
                >
                  Schedule New Appointment
                </h1>
                <button onClick={cancel} className="btn-custom-orange">
                  &#10006;
                </button>
              </div>

              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontWeight: "bold",
                    fontSize: "14px",
                    padding: "10px 20px",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ width: "50%", display: "flex", gap: "0.4rem" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "30%",
                        }}
                      >
                        Selected Date <span>:</span>
                      </label>
                      <span>
                        {selectedDate
                          ? `${formatDateToDDMMYYYY(selectedDate)}`
                          : "No date selected"}
                      </span>
                    </div>

                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        gap: "0.4rem",
                        textAlign: "left",
                        alignItems: "flex-start",
                      }}
                    >
                      <label
                        style={{
                          width: "30%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Applicant Name <span>:</span>
                      </label>
                      <span
                        style={{
                          wordBreak: "break-word",
                          flex: 1,
                        }}
                      >
                        {formData?.patientName}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ width: "50%", display: "flex", gap: "0.4rem" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "30%",
                        }}
                      >
                        Selected Slot <span>:</span>
                      </label>
                      <span>{selectedslottime}</span>
                    </div>

                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        gap: "0.4rem",
                        textAlign: "left",
                        alignItems: "flex-start",
                      }}
                    >
                      <label
                        style={{
                          whiteSpace: "nowrap",
                          width: "30%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Passport No <span>:</span>
                      </label>
                      <span
                        style={{
                          wordBreak: "break-word",
                          flex: 1,
                        }}
                      >
                        {formData?.passportNo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  {stepIndex === 0 && (
                    <>
                      {appointmentType === "Group" && stepIndex === 0 ? (
                        <>
                          {" "}
                          {members.map((member: any, i: number) => (
                            <Accordion key={i} defaultExpanded={i === 0}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="d-flex align-items-center">
                                  {i === 0 ? (
                                    <>
                                      Primary Member Details
                                      <span
                                        style={{
                                          backgroundColor: "#28a745",
                                          color: "white",
                                          borderRadius: "5px",
                                          padding: "2px 8px",
                                          fontSize: "12px",
                                          marginLeft: "10px",
                                        }}
                                      >
                                        Primary
                                      </span>
                                    </>
                                  ) : (
                                    `Member ${i + 1} Details`
                                  )}
                                </Typography>
                              </AccordionSummary>

                              <AccordionDetails>
                                <div className="border p-3 rounded">
                                  <div className="row mb-3">
                                    <div className="col-md-6 d-flex align-items-center">
                                      <label style={{ width: "150px" }}>
                                        Applicant Name:
                                      </label>
                                      <input
                                        type="text"
                                        name="patientName"
                                        className="form-control flex-grow-1"
                                        value={member.patientName}
                                        onChange={(e) => handleChange(e, i)}
                                      />
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center">
                                      <label style={{ width: "150px" }}>
                                        Age:
                                      </label>
                                      <input
                                        type="text"
                                        name="age"
                                        className="form-control flex-grow-1"
                                        maxLength={3}
                                        value={member.age}
                                        onChange={(e) => handleChange(e, i)}
                                      />
                                    </div>
                                  </div>

                                  <div className="row mb-3">
                                    <div className="col-md-6 d-flex align-items-center">
                                      <label style={{ width: "150px" }}>
                                        Gender:
                                      </label>
                                      <select
                                        name="gender"
                                        className="form-control flex-grow-1"
                                        value={member.gender}
                                        onChange={(e) => handleChange(e, i)}
                                      >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="other">Other</option>
                                      </select>
                                    </div>

                                    <div className="col-md-6 d-flex align-items-center">
                                      <label style={{ width: "150px" }}>
                                        DOB:
                                      </label>
                                      <input
                                        type="date"
                                        name="dob"
                                        className="form-control flex-grow-1"
                                        value={member.dob}
                                        onChange={(e) => handleChange(e, i)}
                                      />
                                    </div>
                                  </div>

                                  <div className="row mb-3">
                                    <div className="col-md-6 d-flex align-items-center">
                                      <label style={{ width: "150px" }}>
                                        Passport No:
                                      </label>
                                      <input
                                        type="text"
                                        name="passportNo"
                                        className="form-control flex-grow-1"
                                        value={member.passportNo}
                                        onChange={(e) => handleChange(e, i)}
                                        maxLength={12}
                                      />
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center mt-3">
                                      <label style={{ width: "150px" }}>
                                        Contact Number:
                                      </label>
                                      <input
                                        type="text"
                                        name="contactNumber"
                                        className="form-control flex-grow-1"
                                        value={member.contactNumber}
                                        onChange={(e) => handleChange(e, i)}
                                        maxLength={10}
                                      />
                                    </div>

                                    {i === 0 && (
                                      <>
                                        <div className="col-md-6 d-flex align-items-center">
                                          <label style={{ width: "150px" }}>
                                            Hap ID:
                                          </label>
                                          <input
                                            type="text"
                                            name="hapId"
                                            className="form-control flex-grow-1"
                                            value={member.hapId}
                                            onChange={(e) => handleChange(e, i)}
                                            maxLength={15}
                                          />
                                        </div>

                                        <div className="col-md-6 d-flex align-items-center mt-3">
                                          <label style={{ width: "150px" }}>
                                            Email:
                                          </label>
                                          <input
                                            type="email"
                                            name="email"
                                            className="form-control flex-grow-1"
                                            value={member.email}
                                            onChange={(e) => handleChange(e, i)}
                                          />
                                        </div>

                                        <div className="col-md-6 d-flex align-items-center mt-3">
                                          <label style={{ width: "150px" }}>
                                            Alternative Number:
                                          </label>
                                          <input
                                            type="text"
                                            name="alternativeNumber"
                                            maxLength={10}
                                            className="form-control flex-grow-1"
                                            value={member.alternativeNumber}
                                            onChange={(e) => handleChange(e, i)}
                                          />
                                        </div>

                                        <div className="col-md-6 d-flex align-items-center mt-3">
                                          <label style={{ width: "150px" }}>
                                            Payment Method:
                                          </label>
                                          <select
                                            name="paymentMethod"
                                            className="form-control flex-grow-1"
                                            value={member.paymentMethod}
                                            onChange={(e) => handleChange(e, i)}
                                          >
                                            <option value="">Select</option>
                                            <option value="QR">QR</option>
                                          </select>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </>
                      ) : (
                        <form>
                          <div className="row mb-3">
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="patientName"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Applicant Name:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.patientName ? "is-invalid" : ""
                                }`}
                                id="patientName"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Hap ID:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.hapId ? "is-invalid" : ""
                                }`}
                                id="hapId"
                                inputMode="numeric"
                                pattern="\d*"
                                name="hapId"
                                value={formData.hapId}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    handleChange(e); // only allow digits
                                  }
                                }}
                                maxLength={8}
                                placeholder={getDynamicPlaceholder("hapId")}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="email"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Email:
                              </label>
                              <input
                                type="email"
                                id="email"
                                className={`form-control flex-grow-1 ${
                                  formErrors.email ? "is-invalid" : ""
                                }`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={getDynamicPlaceholder("email")}
                              />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="contactNumber"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Contact Number:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.contactNumber ? "is-invalid" : ""
                                }`}
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                maxLength={10}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    handleChange(e); // only allow digits
                                  }
                                }}
                                placeholder={getDynamicPlaceholder(
                                  "contactNumber"
                                )}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="alternativeNumber"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Alternative Number:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.alternativeNumber
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="alternativeNumber"
                                name="alternativeNumber"
                                value={formData.alternativeNumber}
                                maxLength={10}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    handleChange(e); // only allow digits
                                  }
                                }}
                                placeholder={getDynamicPlaceholder(
                                  "alternativeNumber"
                                )}
                              />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="gender"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Gender:
                              </label>
                              <select
                                className={`form-control flex-grow-1 ${
                                  formErrors.gender ? "is-invalid" : ""
                                }`}
                                name="gender"
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                              >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="dob"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                DOB:
                              </label>
                              <input
                                type="date"
                                className={`form-control flex-grow-1 ${
                                  formErrors.dob ? "is-invalid" : ""
                                }`}
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                max={getYesterdayDate()}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="age"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Age:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.age ? "is-invalid" : ""
                                }`}
                                id="age"
                                name="age"
                                value={formData.age}
                                maxLength={3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="passportNo"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Passport No:
                              </label>
                              <input
                                type="text"
                                className={`form-control flex-grow-1 ${
                                  formErrors.passportNo ? "is-invalid" : ""
                                }`}
                                id="passportNo"
                                name="passportNo"
                                value={formData.passportNo}
                                onChange={handleChange}
                                maxLength={12}
                                placeholder={getDynamicPlaceholder(
                                  "passportNo"
                                )}
                              />
                            </div>

                            <div className="col-md-6 d-flex align-items-center">
                              <label
                                htmlFor="paymentMethod"
                                className="me-2 mb-0"
                                style={{ width: "150px" }}
                              >
                                Payment Method:
                              </label>
                              <select
                                className={`form-control flex-grow-1 ${
                                  formErrors.paymentMethod ? "is-invalid" : ""
                                }`}
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                              >
                                <option value="">Select</option>
                                <option value="QR">QR</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      )}
                    </>
                  )}

                  {stepIndex === 1 && (
                    <div className="payment-section">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px",
                          marginBottom: "20px",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          Price Details <span>:</span>
                        </h1>
                        <h1
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          Scan the QR code to pay
                        </h1>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "5px",
                            gap: "10px",
                            fontSize: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "160px",
                              }}
                            >
                              Price <span>:</span>
                            </label>{" "}
                            <span>&#8377; 999</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "160px",
                                fontWeight: "bold",
                              }}
                            >
                              Enter Transaction ID<span>:</span>
                            </label>
                            <input
                              style={{ padding: "5px" }}
                              name="TransactionId"
                              value={formData.TransactionId}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <img
                            src={dummyqr}
                            alt="QR Code"
                            style={{ width: 250, height: 280 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>

              <div className="modal-footer d-flex justify-content-end gap-2">
                <button className="btn-custom-orange" onClick={clear}>
                  Clear
                </button>
                <button className="btn-custom-orange" onClick={cancel}>
                  Cancel
                </button>
                {stepIndex > 0 && (
                  <button className="btn-custom-orange" onClick={prevStep}>
                    Prev
                  </button>
                )}
                {stepIndex === 0 && (
                  <button className="btn-custom-orange" onClick={nextStep}>
                    Next
                  </button>
                )}
                {stepIndex === 1 && (
                  <button className="btn-custom-orange" onClick={onSubmit}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {showDialog1 && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h1
                  style={{ fontSize: "30px", fontWeight: "bold" }}
                  className="modal-title w-100 text-center"
                >
                  Find Your Bill Receipt's
                </h1>
                <span
                  onClick={cancel1}
                  style={{ cursor: "pointer", opacity: 0.6, fontSize: 18 }}
                >
                  &#10006;
                </span>
              </div>

              <div className="modal-body">
                {invoiceUrls.length > 0 ? (
                  invoiceUrls.map((url: string, index: number) => (
                    <div key={index} className="mb-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-100"
                      >
                        📄 View Receipt {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No invoice URLs available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AppointmentBooking;
