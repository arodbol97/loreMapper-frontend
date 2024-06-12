import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewLoreBit from '../src/components/NewLoreBit';

jest.mock('axios');


describe('NewLoreBit', () => {

    const WORLD_ID = 1;        
    const POST_RESPONSE = {
        "data": {
            "loreBitData": {
                "created": true
            }
        }
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call axios with the correct data when form is submitted', async () => {
        const getLoreBits = jest.fn();
        const setNewLoreBit = jest.fn();        
        axios.post.mockResolvedValue(POST_RESPONSE);
        const { container} = render(<NewLoreBit worldId={WORLD_ID} setShowNewForm={setNewLoreBit} getLoreBits={getLoreBits}/>);
        const nameInput = container.querySelector('#loreBitTitleForm');
        const descriptionInput = container.querySelector('#loreBitDescriptionForm');        
        const submitButton = container.querySelector('#submitLoreBitButton');
        const URL = 'https://loremapper-backend-b042c39916b5.herokuapp.com/loreBit/create'
        const EXPECTED_REQUEST_DATA = {
            loreBitWorld: WORLD_ID,  
            loreBitTitle: 'LoreBit Title',            
            loreBitDescription: "LoreBit Description",            
        };
    
        fireEvent.change(nameInput, { target: { value: 'LoreBit Title' } });
        fireEvent.change(descriptionInput, { target: { value: 'LoreBit Description' } });
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledTimes(1);
          expect(axios.post).toHaveBeenCalledWith(URL, EXPECTED_REQUEST_DATA);
        });
      });



      it('should match snapshot', async () => {
        const getLoreBits = jest.fn();
        const setNewLoreBit = jest.fn();  
        const { asFragment } = render(<NewLoreBit worldId={WORLD_ID} setShowNewForm={setNewLoreBit} getLoreBits={getLoreBits}/>);
        expect(asFragment()).toMatchSnapshot();
      });

});
