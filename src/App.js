import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  TextField, 
  Typography, 
  Alert, 
  Container, 
  Paper 
} from '@mui/material';

const TicketBookingUI = ({setToken}) => {
  // Exact configuration: 11 rows of 7 seats, 1 row of 3 seats
  const TOTAL_ROWS = 12;
  const ROW_CONFIGURATIONS = [
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3  // 11 rows of 7, last row of 3
  ];
  const MAX_BOOKING = 7;

  // Initial state of seats (all green initially)
  const [seats, setSeats] = useState(() => 
    ROW_CONFIGURATIONS.map(seatsInRow => 
      Array(seatsInRow).fill(0)
    )
  );

  const [bookingMessage, setBookingMessage] = useState('');
  const [seatNumber, setSeatNumber] = useState('');

  const handleLogout = () => {
    setToken(null);
  };

  // Check if requested number of seats can be booked in a single row
  const checkSingleRowBooking = (row, seatsToBook) => {
    const emptySeatCount = seats[row].filter(seat => seat === 0).length;
    return emptySeatCount >= seatsToBook;
  };

  // Find best row for booking using sliding window
  const findBestRowForBooking = (seatsToBook) => {
    // First, try single row booking
    for (let row = 0; row < TOTAL_ROWS; row++) {
      if (checkSingleRowBooking(row, seatsToBook)) {
        return { row, type: 'single' };
      }
    }

    // If single row fails, try sliding window across multiple rows
    for (let k = 2; k <= TOTAL_ROWS; k++) {
      for (let startRow = 0; startRow <= TOTAL_ROWS - k; startRow++) {
        let totalEmptySeats = 0;
        
        // Count empty seats in the k consecutive rows
        for (let r = startRow; r < startRow + k; r++) {
          totalEmptySeats += seats[r].filter(seat => seat === 0).length;
        }

        // If total empty seats are sufficient
        if (totalEmptySeats >= seatsToBook) {
          return { row: startRow, type: 'multi', rowsSpan: k };
        }
      }
    }

    return null; // No suitable seats found
  };

  // Book seats in the best row
  const bookSeats = (seatsToBook) => {
    const bookingDetails = findBestRowForBooking(seatsToBook);

    if (!bookingDetails) {
      setBookingMessage('Cannot book seats. Not enough available seats.');
      return false;
    }

    const newSeats = seats.map(row => [...row]);

    if (bookingDetails.type === 'single') {
      // Book in a single row
      let seatsBooked = 0;
      for (let i = 0; i < newSeats[bookingDetails.row].length; i++) {
        if (newSeats[bookingDetails.row][i] === 0 && seatsBooked < seatsToBook) {
          newSeats[bookingDetails.row][i] = 1;
          seatsBooked++;
        }
      }
      setSeats(newSeats);
      setBookingMessage(`Booked ${seatsToBook} seats in row ${bookingDetails.row + 1}`);
      return true;
    } else {
      // Book across multiple rows
      let seatsBooked = 0;
      for (let row = bookingDetails.row; row < bookingDetails.row + bookingDetails.rowsSpan; row++) {
        for (let i = 0; i < newSeats[row].length; i++) {
          if (newSeats[row][i] === 0 && seatsBooked < seatsToBook) {
            newSeats[row][i] = 1;
            seatsBooked++;
          }
        }
        if (seatsBooked === seatsToBook) break;
      }
      setSeats(newSeats);
      setBookingMessage(`Booked ${seatsBooked} seats across rows ${bookingDetails.row + 1}-${bookingDetails.row + bookingDetails.rowsSpan}`);
      return true;
    }
  };

  // Handle booking when Book button is clicked
  const handleBookTickets = () => {
    const seatsToBook = parseInt(seatNumber);

    // Validate input
    if (isNaN(seatsToBook) || seatsToBook <= 0) {
      setBookingMessage('Please enter a valid number of seats');
      return;
    }

    if (seatsToBook > MAX_BOOKING) {
      setBookingMessage(`Cannot book more than ${MAX_BOOKING} seats at a time`);
      return;
    }

    // Attempt to book seats
    bookSeats(seatsToBook);
  };

  // Reset booking
  const handleResetBooking = () => {
    setSeats(ROW_CONFIGURATIONS.map(seatsInRow => Array(seatsInRow).fill(0)));
    setSeatNumber('');
    setBookingMessage('');
  };

  // Calculate total seat numbers
  const calculateSeatNumber = (rowIndex, seatIndex) => {
    let totalSeatsBefore = 0;
    for (let i = 0; i < rowIndex; i++) {
      totalSeatsBefore += ROW_CONFIGURATIONS[i];
    }
    return totalSeatsBefore + seatIndex + 1;
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Ticket Booking
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ position: 'absolute', top: 20, right: 20 }}>
          Logout
        </Button>
        
        <Grid container spacing={1} justifyContent="center">
          {seats.map((row, rowIndex) => (
            <Grid 
              container 
              item 
              xs={12} 
              spacing={1} 
              key={rowIndex} 
              justifyContent="center"
            >
              {row.map((seat, seatIndex) => (
                <Grid item key={`${rowIndex}-${seatIndex}`}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: seat === 1 ? 'yellow' : 'green',
                      border: 1,
                      borderColor: 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1
                    }}
                  >
                    {calculateSeatNumber(rowIndex, seatIndex)}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Typography sx={{ mr: 2 }}>
            Booked Seats = {seats.flat().filter(seat => seat === 1).length}
          </Typography>
          <Typography>
            Available Seats = {seats.flat().filter(seat => seat === 0).length}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
          <TextField
            label="Book Seats (Max 7)"
            variant="outlined"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleBookTickets}
          >
            Book
          </Button>
        </Box>

        <Button 
          variant="outlined" 
          color="secondary"
          onClick={handleResetBooking}
          fullWidth
        >
          Reset Booking
        </Button>

        {bookingMessage && (
          <Alert 
            severity={bookingMessage.includes('Cannot') ? 'error' : 'success'} 
            sx={{ mt: 2 }}
            onClose={() => setBookingMessage('')}
          >
            {bookingMessage}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default TicketBookingUI;