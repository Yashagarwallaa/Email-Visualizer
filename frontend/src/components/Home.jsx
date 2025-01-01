import React, { useState, useEffect } from 'react';

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState(null);
  const [filter, setFilter] = useState('all');
  const [favoriteEmails, setFavoriteEmails] = useState([]);
  const [readEmails, setReadEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: '#F4F5F9',
    text: '#636363',
    accent: '#E54065'
  };

  // Load favorites and read emails from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteEmails');
    const savedReadEmails = localStorage.getItem('readEmails');
    
    if (savedFavorites) {
      setFavoriteEmails(JSON.parse(savedFavorites));
    }
    if (savedReadEmails) {
      setReadEmails(JSON.parse(savedReadEmails));
    }
  }, []);

  // Save favorites and read emails to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteEmails', JSON.stringify(favoriteEmails));
  }, [favoriteEmails]);

  useEffect(() => {
    localStorage.setItem('readEmails', JSON.stringify(readEmails));
  }, [readEmails]);

  // Fetch emails when page changes
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://flipkart-email-mock.now.sh/?page=${currentPage}`);
        const data = await response.json();
        setEmails(data.list || []);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
      setIsLoading(false);
    };

    fetchEmails();
  }, [currentPage]);

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    // Mark email as read when clicked
    if (!readEmails.includes(email.id)) {
      setReadEmails(prev => [...prev, email.id]);
    }
    try {
      const response = await fetch(`https://flipkart-email-mock.now.sh/?id=${email.id}`);
      const data = await response.json();
      setEmailBody(data);
    } catch (error) {
      console.error('Error fetching email body:', error);
    }
  };

  const toggleFavorite = (emailId, e) => {
    e.stopPropagation();
    setFavoriteEmails(prev => 
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'favorites') return favoriteEmails.includes(email.id);
    if (filter === 'read') return readEmails.includes(email.id);
    if (filter === 'unread') return !readEmails.includes(email.id);
    return true;
  });

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px',
    width: '10%'
  };

  const pageButtonStyle = (isActive) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? colors.accent : 'white',
    color: isActive ? 'white' : colors.text,
    border: `1px solid ${colors.accent}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  });

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.background,
      minHeight: '100vh'
    }}>
      {/* Filter Section */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <span style={{ color: '#636363' }}>Filter By:</span>
        <div style={{ 
          display: 'flex',
          gap: '5px'
        }}>
          {[
            { label: 'Unread', value: 'unread' },
            { label: 'Read', value: 'read' },
            { label: 'Favorites', value: 'favorites' }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === filterOption.value ? '#E1E4EA' : 'transparent',
                border: 'none',
                borderRadius: '2rem',
                cursor: 'pointer',
                color: '#000000',
                fontSize: '14px',
                fontWeight: filter === filterOption.value ? '700' : 'normal'
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email List and Body Section */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexDirection: window.innerWidth <= 768 ? 'column' : selectedEmail ? 'row' : 'column'
      }}>
        {/* Email List */}
        <div style={{ 
          flex: '0 0 auto', 
          width: window.innerWidth <= 768 ? '100%' : (selectedEmail ? '350px' : '100%'),
          maxWidth: '100%'
        }}>
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => handleEmailClick(email)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: selectedEmail?.id === email.id ? '#F2F2F2' : 'white',
                border: selectedEmail?.id === email.id ? `2px solid ${colors.accent}` : '1px solid #CFD2DC',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  color: 'white',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {email.from.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ color: colors.text }}>From: </span>
                    <span style={{ 
                      color: colors.text, 
                      fontWeight: 'bold'
                    }}>
                      {email.from.name} {`<${email.from.email}>`}
                    </span>
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ color: colors.text }}>Subject: </span>
                    <span style={{ 
                      color: colors.text, 
                      fontWeight: 'bold'
                    }}>
                      {email.subject}
                    </span>
                  </div>
                  <div style={{ 
                    color: colors.text,
                    marginBottom: '5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {email.short_description}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: colors.text,
                    fontSize: '14px'
                  }}>
                    <div>{formatDate(email.date)}</div>
                    {favoriteEmails.includes(email.id) && 
                      <div style={{ color: colors.accent }}>Favorite</div>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Body */}
        {selectedEmail && emailBody && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '1px solid #CFD2DC',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  color: 'white',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {selectedEmail.from.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <h2 style={{ 
                      margin: 0, 
                      color: '#636363',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>{selectedEmail.subject}</h2>
                    <button
                      onClick={(e) => toggleFavorite(selectedEmail.id, e)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: colors.accent,
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '14px',
                        width: window.innerWidth <= 768 ? '100%' : '180px'
                      }}
                    >
                      {favoriteEmails.includes(selectedEmail.id) 
                        ? 'Remove from favorites' 
                        : 'Mark as favorite'
                      }
                    </button>
                  </div>
                  <div style={{ color: colors.text }}>
                    {formatDate(selectedEmail.date)}
                  </div>
                </div>
              </div>
              <div 
                dangerouslySetInnerHTML={{ __html: emailBody.body }}
                style={{ 
                  color: colors.text,
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={paginationStyle}>
        <button 
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          style={pageButtonStyle(currentPage === 1)}
        >
          1
        </button>
        <button 
          onClick={() => setCurrentPage(2)}
          disabled={currentPage === 2}
          style={pageButtonStyle(currentPage === 2)}
        >
          2
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: colors.text
        }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default Home;
