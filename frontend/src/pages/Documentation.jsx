import React from 'react';

function Documentation() {
  return (
    <div>
        <h1>Documentation</h1>

        <h3>Check-In/Out Tab</h3>
        <h5>Overview</h5>
        <p>
            The Check-In/Out tab allows users to manage their daily attendance and project engagement. 
            When assigned to a project, users can report the start and end of their working sessions for accurate time tracking.
        </p>
        
        <h5>Checking In</h5>
        <p>
            To Check-In to a project, locate the project you are assigned to from the list presented. 
            Next to the project details, you will see a green "Check-In" button. Clicking this button will 
            record the time you started working on the project.
        </p>
        
        <h5>Checking Out</h5>
        <p>
            Once you have completed your work, or are taking a break, click the red "Check-Out" button next 
            to the corresponding project. This will record the time you stopped working, ensuring accurate 
            time tracking and reporting.
        </p>
        
        <h5>Tips</h5>
        <ul>
            <li>Ensure to Check-In as soon as you begin your work to maintain precise work records.</li>
            <li>Do not forget to Check-Out during your breaks or at the end of your shift to prevent discrepancies.</li>
            <li>If you accidentally Check-In or Check-Out, contact your administrator to correct your timesheet.</li>
        </ul>

        {/* Reports Section */}
        <h3>Reports Tab</h3>
        <h5>Overview</h5>
            <p>
                The Reports tab provides users with the ability to generate and view various reports based on time entries. 
                Users can filter reports on a daily, weekly, monthly, or yearly basis to gain insights into their work hours, 
                project engagement, and income.
            </p>
            
            <h5>Generating Reports</h5>
            <p>
                To generate a report, select the desired time frame tab—Daily, Weekly, Monthly, or Yearly. 
                Use the 'Month Filter' and 'Year Filter' dropdowns to refine your report criteria. After setting 
                the filters, the reports will automatically update to reflect the entries based on the selected period.
            </p>
            
            <h5>No Records Found</h5>
            <p>
                If no records match your search criteria, the message "No records Found" will appear. 
                You can adjust the search filters or click on the 'Change search filters' link to reset your selection.
            </p>
            
            <h5>Downloading Reports</h5>
            <p>
                Once the report is generated, you can download it by clicking on the 'Download' button. 
                This allows you to save the report externally for record-keeping, further analysis, or for administrative purposes.
            </p>
            
            <h5>Tips</h5>
            <ul>
                <li>Regularly check the Reports tab to keep track of your work hours and income.</li>
                <li>Utilize the yearly filter for a broad overview of your work throughout the year.</li>
                <li>Contact your administrator if you encounter any discrepancies in your reports.</li>
            </ul>
      
    </div>
  );
}

export default Documentation;