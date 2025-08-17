import './App.css';
import React from 'react';


function App() {
  // Initialize state to hold the input value

  const [prompt, setPrompt] = React.useState('');
  const [content, setContent] = React.useState(''); 
  const [response, setResponse] = React.useState('');
  
  const handleChangePrompt = (event) => {
    setPrompt(event.target.value);
  };
  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    console.log("Submitting:", { prompt, content }); // Log the values for debugging
    event.preventDefault(); // Prevent the default form submission
    try {
      const res = await fetch(`https://mongodesk-api.onrender.com/api/chat?t=${new Date().getTime()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, content }),
      });
      const data = await res.json();
      setResponse(data); // Update the response state with the result
      
      console.log("API response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleMail = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const to = event.target.to.value; // Get the email address from the form
    try {
      const res = await fetch(`https://mongodesk-api.onrender.com/api/sendMail?t=${new Date().getTime()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject: 'Response from MongoDesk', text: response }),
      });
      const data = await res.json();
      console.log("Email response:", data);
      alert(data.message); // Show success message
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  }; 

  return (
    <div className="App">
       <form onSubmit={handleSubmit} className='form'>
        <label>
          content:
          <textarea type="text" value={content} onChange={handleChangeContent} />
        </label>
        <label>
          prompt:
          <textarea type="text" value={prompt} onChange={handleChangePrompt} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className='response'>
        <h2>Response:</h2>
        <textarea
          className='responseArea'
          value={
            (() => {
              if (!response) return '';
              // If response is a string, try to parse it as JSON
              let respObj = response;
              if (typeof response === 'string') {
                try {
                  respObj = JSON.parse(response);
                } catch {
                  return response; // Not JSON, just return as is
                }
              }
              // Now respObj is an object
              if (respObj.summary) {
                return `Summary: ${respObj.summary}\nDetails: ${respObj.details || ''}`;
              }
              return JSON.stringify(respObj, null, 2);
            })()
          }
          rows={8}
          cols={60}
        />
      </div>
      <div>
        <form onSubmit={handleMail} className='formMail'>
          <label>
            Mail To:
            <input type="email" name="to" required />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default App;
