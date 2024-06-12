import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewFaction from '../src/components/NewFaction';

jest.mock('axios');


describe('NewFaction', () => {

    const WORLD_ID = 1;        
    const POST_RESPONSE = {
        "data": {
            "factionData": {
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
        const getFactions = jest.fn();
        axios.post.mockResolvedValue(POST_RESPONSE);
        const { container} = render(<NewFaction worldId={WORLD_ID} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getFactions={getFactions}/>);
        const nameInput = container.querySelector('#factionNameForm');
        const descriptionInput = container.querySelector('#factionDescriptionForm');
        const colorInput = container.querySelector('#factionColorForm');        
        const submitButton = container.querySelector('#submitFactionButton');
        const URL = 'https://loremapper-backend-b042c39916b5.herokuapp.com/faction/create'
        const EXPECTED_REQUEST_DATA = {
            factionWorld: WORLD_ID,  
            factionName: 'Faction Name',            
            factionDescription: "Faction Description",
            factionColor: "#000000"
        };
    
        fireEvent.change(nameInput, { target: { value: 'Faction Name' } });
        fireEvent.change(descriptionInput, { target: { value: 'Faction Description' } });
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
        const getFactions = jest.fn();
        const { asFragment } = render(<NewFaction worldId={WORLD_ID} displayMarkers={displayMarkers} setShowNewForm={setShowNewForm} getFactions={getFactions}/>);
        expect(asFragment()).toMatchSnapshot();
      });

});
