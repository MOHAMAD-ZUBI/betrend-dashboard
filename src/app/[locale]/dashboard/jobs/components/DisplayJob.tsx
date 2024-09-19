"use cleint";

import React from "react";

interface Job {
  _id: string;
  title: string;
  company: { name: string; location: string };
  salary: { min: number; max: number; currency: string };
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  employmentType: string;
  experienceLevel: string;
  benefits: string[];
  deadline: string;
  tags: string[];
  isRemote: boolean;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

const DisplayJob = ({ job }: { job: Job }) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">{job.title}</h2>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{job.company.name}</p>
          <p>{job.company.location}</p>
        </div>
        <div className="text-right">
          <p>{job.employmentType}</p>
          <p>{job.experienceLevel}</p>
        </div>
      </div>

      <div>
        <p className="font-semibold">Salary Range:</p>
        <p>{`${job.salary.min} - ${job.salary.max} ${job.salary.currency}`}</p>
      </div>

      <div>
        <p className="font-semibold">Job Description:</p>
        <p>{job.jobDescription}</p>
      </div>

      <div>
        <p className="font-semibold">Requirements:</p>
        <ul className="list-disc pl-5">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Responsibilities:</p>
        <ul className="list-disc pl-5">
          {job.responsibilities.map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Benefits:</p>
        <ul className="list-disc pl-5">
          {job.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center">
        <p>Remote: {job.isRemote ? "Yes" : "No"}</p>
        <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
      </div>

      <div>
        <p className="font-semibold">Tags:</p>
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
        <p>Last updated: {new Date(job.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default DisplayJob;
