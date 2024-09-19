"use client";
import React, { useState } from "react";
import {
  Input,
  Textarea,
  Checkbox,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface CreateJobFormProps {
  onSubmit: (jobData: any) => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [benefits, setBenefits] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      title,
      company: { name: companyName, location: companyLocation },
      jobDescription,
      requirements: requirements.split("\n"),
      responsibilities: responsibilities.split("\n"),
      employmentType,
      experienceLevel,
      salary: {
        min: parseInt(salaryMin),
        max: parseInt(salaryMax),
        currency: salaryCurrency,
      },
      benefits: benefits.split("\n"),
      isRemote,
      deadline,
      tags: tags.split(",").map((tag) => tag.trim()),
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
        />
        <Input
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="w-full"
        />
        <Input
          label="Company Location"
          value={companyLocation}
          onChange={(e) => setCompanyLocation(e.target.value)}
          required
          className="w-full"
        />
        <Select
          label="Employment Type"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          required
          className="w-full"
        >
          <SelectItem key="fulltime" value="Full-time">
            Full-time
          </SelectItem>
          <SelectItem key="parttime" value="Part-time">
            Part-time
          </SelectItem>
          <SelectItem key="contract" value="Contract">
            Contract
          </SelectItem>
        </Select>
        <Select
          label="Experience Level"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          required
          className="w-full"
        >
          <SelectItem key="entry" value="Entry level">
            Entry level
          </SelectItem>
          <SelectItem key="mid" value="Mid level">
            Mid level
          </SelectItem>
          <SelectItem key="senior" value="Senior level">
            Senior level
          </SelectItem>
        </Select>
        <Input
          type="date"
          label="Application Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <Textarea
        label="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        required
        className="w-full min-h-[100px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Requirements (one per line)"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          required
          className="w-full min-h-[100px]"
        />
        <Textarea
          label="Responsibilities (one per line)"
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          required
          className="w-full min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="number"
          label="Minimum Salary"
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value)}
          required
          className="w-full"
        />
        <Input
          type="number"
          label="Maximum Salary"
          value={salaryMax}
          onChange={(e) => setSalaryMax(e.target.value)}
          required
          className="w-full"
        />
        <Select
          label="Currency"
          value={salaryCurrency}
          onChange={(e) => setSalaryCurrency(e.target.value)}
          required
          className="w-full"
        >
          <SelectItem key="usd" value="USD">
            USD
          </SelectItem>
          <SelectItem key="eur" value="EUR">
            EUR
          </SelectItem>
          <SelectItem key="gbp" value="GBP">
            GBP
          </SelectItem>
        </Select>
      </div>

      <Textarea
        label="Benefits (one per line)"
        value={benefits}
        onChange={(e) => setBenefits(e.target.value)}
        className="w-full min-h-[100px]"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Checkbox
          isSelected={isRemote}
          onValueChange={setIsRemote}
          className="self-start"
        >
          Remote Job
        </Checkbox>
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full sm:w-2/3"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" color="primary" size="lg">
          Create Job Listing
        </Button>
      </div>
    </form>
  );
};

export default CreateJobForm;
