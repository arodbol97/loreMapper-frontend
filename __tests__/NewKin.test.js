import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewKin from '../src/components/NewKin';

jest.mock('axios');


describe('NewKin', () => {

    const WORLD_ID = 1;        
    const POST_RESPONSE = {
        "data": {
            "kinData": {
                "created": true
            }
        }
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call axios with the correct data when form is submitted', async () => {
        const displayMarkers = jest.fn();
        const setShowNewForm = jest.fn();
        const getKins = jest.fn();
        axios.post.mockResolvedValue(POST_RESPONSE);
        const { container} = render(<NewKin worldId={WORLD_ID} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getKins={getKins}/>);
        const nameInput = container.querySelector('#kinNameForm');
        const descriptionInput = container.querySelector('#kinDescriptionForm');
        const colorInput = container.querySelector('#kinColorForm');        
        const submitButton = container.querySelector('#submitKinButton');
        const URL = 'https://loremapper-backend-b042c39916b5.herokuapp.com/kin/create'
        const EXPECTED_REQUEST_DATA = {
            kinWorld: WORLD_ID,  
            kinName: 'Kin Name',            
            kinDescription: "Kin Description",
            kinColor: "#000000"
        };
    
        fireEvent.change(nameInput, { target: { value: 'Kin Name' } });
        fireEvent.change(descriptionInput, { target: { value: 'Kin Description' } });
        fireEvent.change(colorInput, { target: { value: '#000000' } });        
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledTimes(1);
          expect(axios.post).toHaveBeenCalledWith(URL, EXPECTED_REQUEST_DATA);
        });
      });



      it('should match snapshot', async () => {
        const displayMarkers = jest.fn();
        const setShowNewForm = jest.fn();
        const getKins = jest.fn();
        const { asFragment } = render(<NewKin worldId={WORLD_ID} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getKins={getKins}/>);
        expect(asFragment()).toMatchSnapshot();
      });

});
