import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const DailyChecklistMCQ = ({ templateId }) => {
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [templateType, setTemplateType] = useState("MCQ");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [labels, setLabels] = useState("");
  const [labelTexts, setLabelTexts] = useState({});
  const [checklistView, setChecklistView] = useState(false);


const handleAnswerChange = (label, value) => {
  setAnswers((prevAnswers) => ({
    ...prevAnswers,
    [label]: value,  // Update the specific answer for the label
  }));
};


  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) {
        console.error("No template ID provided");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/template/${templateId}`);
        const template = response.data;

        setTitle(template.title || "");
        setHeading(template.heading || "");
        setDepartment(template.department || "");
        setSection(template.section || "");
        setLabels(template.labels || "");
        setTemplateType(template.template || "MCQ");
        setQuestions(template.questions || []);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [templateId]);

  const handleCheckboxChange = (questionId, option) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prevAnswers,
          [questionId]: currentAnswers.filter((answer) => answer !== option),
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleLabelTextChange = (index, value) => {
    setLabelTexts((prevTexts) => ({
      ...prevTexts,
      [index]: value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // const handleSubmit = async () => {
  //   const checklistData = {
  //     title,
  //     heading,
  //     department,
  //     section,
  //     templateType,
  //     selectedDate,
  //     labels: labelTexts,
  //     answers,
  //   };

  //   try {
  //     await axios.post("http://localhost:3001/api/submit-checklist", checklistData);
  //     alert("Checklist submitted successfully!");
  //   } catch (error) {
  //     console.error("Error submitting checklist:", error);
  //     alert("Failed to submit the checklist.");
  //   }
  // };

  const handleSubmit = async () => {
    const checklistData = {
      title,
      heading,
      department,
      section,
      templateType,
      selectedDate,
      labels: labelTexts,
      answers,  // This should now contain the answers as an object
    };
  
    console.log("Submitting checklist:", checklistData);
  
    try {
      await axios.post("http://localhost:3001/api/submit-checklist", checklistData);
      alert("Checklist submitted successfully!");
    } catch (error) {
      console.error("Error submitting checklist:", error);
      alert("Failed to submit the checklist.");
    }
  };
  

  const handleClear = () => {
    setLabelTexts({});
    setAnswers({});
    setSelectedDate(null);
  };

  const labelArray = labels.split(",");
  const labelChunks = chunkArray(labelArray, 3);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Paper sx={{ padding: 2, border: "2px solid black", borderRadius: 2 }}>
          <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            {heading && <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{heading}</Typography>}
          </Box>
          <Table size="small" sx={{ border: "1px solid black" }}>
            <TableBody>
              {labelChunks.map((chunk, chunkIndex) => (
                <TableRow key={chunkIndex}>
                  {chunk.map((label, idx) => (
                    <TableCell key={idx} colSpan={2} sx={{ border: "1px solid black" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ marginRight: 1 }}>{label}</Typography>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={labelTexts[chunkIndex * 3 + idx] || ""}
                          onChange={(e) => handleLabelTextChange(chunkIndex * 3 + idx, e.target.value)}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={6} sx={{ border: "1px solid black" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ marginRight: 1 }}>Date:</Typography>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Department:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{department}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Section:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{section}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Type:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{templateType}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table size="small" sx={{ border: "1px solid black", marginTop: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Question</TableCell>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                      {question.question}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                      {question.options.map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              checked={answers[question.id]?.includes(option) || false}
                              onChange={() => handleCheckboxChange(question.id, option)}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>No questions available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>

          {checklistView && (
            <Paper
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '595px',
                height: '500px',
                padding: '32px',
                zIndex: 1000,
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {heading}
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Typography variant="h7" sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Department : {department}
                </Typography>
                <Typography variant="h7" sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Section : {section}
                </Typography>
              </Box>
              <Box>
                {Array.isArray(questions) &&
                  questions.map((question, index) => (
                    <Box key={index} mt={2}>
                      <Typography variant="h6">{question.question}</Typography>
                      {question.options.map((option) => (
                        <Typography variant="body2" key={option}>
                          {option}
                        </Typography>
                      ))}
                    </Box>
                  ))}
              </Box>
            </Paper>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default DailyChecklistMCQ;
