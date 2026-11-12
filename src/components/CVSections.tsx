import React from 'react';
import { CVData } from '../data/cvData';
import {
  PortfolioImagesConfig,
  resolveProjectScreenshots,
  getPublishedCertificates,
} from '../utils/portfolioLogic';
import { ProtectedImage } from './ProtectedImage';

interface CVSectionsProps {
  data: CVData;
  images: PortfolioImagesConfig;
}

export const CVSections: React.FC<CVSectionsProps> = ({ data, images }) => {
  const publishedCertificates = getPublishedCertificates(images.certificates);

  return (
    <div className="cv-sections-container">
      {/* 1. PROFESSIONAL SUMMARY */}
      <section
        id="professional-summary"
        className="cv-section cv-summary-section"
        aria-labelledby="heading-summary"
      >
        <h2 id="heading-summary" className="cv-section-heading">
          Professional Summary
        </h2>
        <div className="cv-summary-content">
          {data.professionalSummary.map((paragraph, idx) => (
            <p key={idx} className="cv-body-paragraph text-justify">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* 2. CORE COMPETENCIES */}
      <section
        id="core-competencies"
        className="cv-section"
        aria-labelledby="heading-competencies"
      >
        <h2 id="heading-competencies" className="cv-section-heading">
          Core Competencies
        </h2>
        <div className="cv-competencies-grid">
          {data.coreCompetencies.map((comp) => (
            <div key={comp.title} className="cv-competency-item">
              <h3 className="cv-Subheading">{comp.title}</h3>
              <p className="cv-secondary-text text-justify">{comp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WORK EXPERIENCE */}
      <section
        id="work-experience"
        className="cv-section"
        aria-labelledby="heading-experience"
      >
        <h2 id="heading-experience" className="cv-section-heading">
          Work Experience
        </h2>
        <div className="cv-entries-list">
          {data.workExperience.map((job) => (
            <article key={job.id} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-title-group">
                  <h3 className="cv-entry-title">{job.role}</h3>
                  <p className="cv-entry-org">
                    {job.organization}
                    {job.location ? ` · ${job.location}` : ''}
                  </p>
                </div>
                <span className="cv-entry-period">{job.period}</span>
              </div>
              <p className="cv-entry-summary text-justify">{job.summary}</p>
              <ul className="cv-bullet-list">
                {job.responsibilities.map((bullet, idx) => (
                  <li key={idx} className="cv-bullet-item text-justify">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 4. EDUCATION */}
      <section id="education" className="cv-section" aria-labelledby="heading-education">
        <h2 id="heading-education" className="cv-section-heading">
          Education
        </h2>
        <div className="cv-entries-list">
          {data.education.map((edu) => (
            <article key={edu.id} className="cv-entry">
              <div className="cv-entry-header">
                <div className="cv-entry-title-group">
                  <h3 className="cv-entry-title">{edu.degree}</h3>
                  <p className="cv-entry-org">{edu.institution}</p>
                </div>
                <span className="cv-entry-period">{edu.period}</span>
              </div>

              <div className="cv-education-meta">
                <span>
                  <strong>Classification / Status:</strong> {edu.statusOrClassification}
                </span>
                {edu.gpa && (
                  <>
                    <span className="cv-meta-sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="cv-tabular-nums">
                      <strong>GPA:</strong> {edu.gpa}
                    </span>
                  </>
                )}
              </div>

              {edu.specialization && (
                <p className="cv-education-detail-line text-justify">
                  <strong>Specialization:</strong> {edu.specialization}
                </p>
              )}
              {edu.finalYearProject && (
                <p className="cv-education-detail-line text-justify">
                  <strong>Academic &amp; Final-Year Project Work:</strong> {edu.finalYearProject}
                </p>
              )}

              <ul className="cv-bullet-list">
                {edu.details.map((line, idx) => (
                  <li key={idx} className="cv-bullet-item text-justify">
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 5. ACADEMIC AND PROFESSIONAL PROJECTS */}
      <section id="projects" className="cv-section" aria-labelledby="heading-projects">
        <h2 id="heading-projects" className="cv-section-heading">
          Academic and Professional Projects
        </h2>
        <div className="cv-entries-list">
          {data.projects.map((project) => {
            const rawScreenshots = images.projects[project.imageKey];
            const screenshots = resolveProjectScreenshots(rawScreenshots);
            const hasScreenshots = screenshots.length > 0;

            return (
              <article
                key={project.id}
                className={`cv-project-entry ${
                  hasScreenshots ? 'cv-project-with-media' : 'cv-project-text-only'
                }`}
              >
                <div className="cv-project-text-column">
                  <div className="cv-entry-header">
                    <div className="cv-entry-title-group">
                      <h3 className="cv-entry-title">{project.title}</h3>
                      <p className="cv-entry-org">{project.category}</p>
                    </div>
                    <div className="cv-project-tech-inline" aria-label="Technology Stack">
                      <strong>Technology Stack:</strong> {project.techStack.join(' · ')}
                    </div>
                  </div>

                  <p className="cv-body-paragraph text-justify">{project.description}</p>

                  <ul className="cv-bullet-list">
                    {project.highlights.map((item, idx) => (
                      <li key={idx} className="cv-bullet-item text-justify">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {(project.liveUrl || project.githubUrl) && (
                    <div className="cv-project-links">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cv-link"
                        >
                          Live Project ↗
                        </a>
                      )}
                      {project.liveUrl && project.githubUrl && (
                        <span className="cv-meta-sep" aria-hidden="true">
                          ·
                        </span>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cv-link"
                        >
                          GitHub Repository ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Project Screenshots column — renders configured URLs or clean neutral document frame */}
                <div className="cv-project-media-column">
                  {hasScreenshots ? (
                    <div className="cv-project-screenshots-stack">
                      {screenshots.map((url, idx) => (
                        <ProtectedImage
                          key={`${project.id}-shot-${idx}`}
                          src={url}
                          alt={`${project.title} — Screenshot ${idx + 1}`}
                          fallbackType="project"
                          fallbackTitle={project.title}
                          fallbackSubtitle={project.techStack.join(' · ')}
                          className="cv-project-screenshot"
                        />
                      ))}
                    </div>
                  ) : (
                    <ProtectedImage
                      src=""
                      alt={`${project.title} — System Architecture Preview`}
                      fallbackType="project"
                      fallbackTitle={project.title}
                      fallbackSubtitle={`Stack: ${project.techStack.join(' · ')}`}
                      className="cv-project-screenshot"
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. TECHNICAL SKILLS */}
      <section
        id="technical-skills"
        className="cv-section"
        aria-labelledby="heading-technical-skills"
      >
        <h2 id="heading-technical-skills" className="cv-section-heading">
          Technical Skills
        </h2>
        <div className="cv-skills-table">
          {data.technicalSkills.map((group) => (
            <div key={group.category} className="cv-skill-row">
              <div className="cv-skill-category">{group.category}</div>
              <div className="cv-skill-items">{group.items.join(' · ')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PROFESSIONAL STRENGTHS */}
      <section
        id="professional-strengths"
        className="cv-section"
        aria-labelledby="heading-strengths"
      >
        <h2 id="heading-strengths" className="cv-section-heading">
          Professional Strengths
        </h2>
        <div className="cv-strengths-grid">
          {data.professionalStrengths.map((item) => (
            <div key={item.title} className="cv-strength-item">
              <h3 className="cv-Subheading">{item.title}</h3>
              <p className="cv-secondary-text text-justify">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PROFESSIONAL CERTIFICATIONS */}
      <section
        id="certifications"
        className="cv-section"
        aria-labelledby="heading-certifications"
      >
        <h2 id="heading-certifications" className="cv-section-heading">
          Professional Certifications
        </h2>

        {/* Verified ongoing professional qualification */}
        <div className="cv-certification-verified-row">
          <div className="cv-entry-header">
            <div className="cv-entry-title-group">
              <h3 className="cv-entry-title">
                Association of Accounting Technicians of Sri Lanka (AAT Sri Lanka)
              </h3>
              <p className="cv-entry-org">
                Issuing Body: AAT Sri Lanka · Professional Accounting &amp; Financial Systems Qualification
              </p>
            </div>
            <span className="cv-entry-period">In Progress</span>
          </div>
        </div>

        {/* Dynamic Certificate Gallery from portfolioImages.certificates (empty entries hidden automatically) */}
        {publishedCertificates.length > 0 && (
          <div className="cv-certificates-gallery">
            {publishedCertificates.map((cert, index) => (
              <article key={`${cert.title}-${index}`} className="cv-certificate-item">
                {cert.imageUrl && (
                  <div className="cv-certificate-image-box">
                    <ProtectedImage
                      src={cert.imageUrl}
                      alt={`${cert.title} — Issued by ${cert.issuer || 'Issuing Institution'}`}
                      fallbackType="certificate"
                      fallbackTitle={cert.title}
                      fallbackSubtitle={cert.issuer}
                      watermarkText={cert.watermark ? 'Rifath Ahamed · Portfolio Copy' : undefined}
                      className="cv-certificate-preview"
                    />
                  </div>
                )}
                <div className="cv-certificate-meta">
                  <h3 className="cv-Subheading">{cert.title}</h3>
                  {cert.issuer && (
                    <p className="cv-secondary-text">
                      <strong>Issuing Institution:</strong> {cert.issuer}
                    </p>
                  )}
                  {cert.date && (
                    <p className="cv-secondary-text cv-tabular-nums">
                      <strong>Date:</strong> {cert.date}
                    </p>
                  )}
                  {cert.verificationUrl && (
                    <p className="cv-certificate-verify">
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-link"
                      >
                        Verify Credential ↗
                      </a>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 9. LANGUAGES */}
      <section id="languages" className="cv-section" aria-labelledby="heading-languages">
        <h2 id="heading-languages" className="cv-section-heading">
          Languages
        </h2>
        <div className="cv-languages-list">
          {data.languages.map((lang) => (
            <div key={lang.language} className="cv-language-row">
              <div className="cv-language-name">
                <strong>{lang.language}</strong> — <span>{lang.proficiency}</span>
              </div>
              <div className="cv-secondary-text">{lang.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CONTACT INFORMATION */}
      <section
        id="contact-information"
        className="cv-section cv-contact-section"
        aria-labelledby="heading-contact"
      >
        <h2 id="heading-contact" className="cv-section-heading">
          Contact Information
        </h2>
        <div className="cv-contact-grid">
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">Full Name:</span>
            <span className="cv-contact-field-value">{data.personalInfo.fullName}</span>
          </div>
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">Professional Designation:</span>
            <span className="cv-contact-field-value">{data.personalInfo.designation}</span>
          </div>
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">Email Address:</span>
            <span className="cv-contact-field-value">
              <a href={`mailto:${data.personalInfo.email}`} className="cv-link">
                {data.personalInfo.email}
              </a>
            </span>
          </div>
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">Telephone:</span>
            <span className="cv-contact-field-value">{data.personalInfo.telephone}</span>
          </div>
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">Location:</span>
            <span className="cv-contact-field-value">{data.personalInfo.location}</span>
          </div>
          <div className="cv-contact-row">
            <span className="cv-contact-field-label">LinkedIn Profile:</span>
            <span className="cv-contact-field-value">
              {data.personalInfo.linkedinUrl ? (
                <a
                  href={data.personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-link"
                >
                  {data.personalInfo.linkedinLabel}
                </a>
              ) : (
                <span>{data.personalInfo.linkedinLabel}</span>
              )}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
