'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateCandidatePage() {
  const [form, setForm] = useState({
    electionId: '',
    district: '',
    municipality: '',
    mayorCandidates: [],
    deputyMayorCandidates: [],
  });
  const { data: session, status } = useSession();

  const [districtMunicipalities, setDistrictMunicipalities] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const response = await fetch('/District.json');
        if (!response.ok) throw new Error('Failed to fetch district data');
        const data = await response.json();

        const transformedData = data.reduce((acc, item) => {
          acc[item.name] = item.municipalities;
          return acc;
        }, {});

        setDistrictMunicipalities(transformedData);
      } catch (error) {
        toast.error('Failed to fetch district data');
        console.error(error);
      }
    };

    fetchDistrictData();
  }, []);

  const handleInputChange = (postType, index, field, value) => {
    const updatedCandidates = [...form[postType]];
    updatedCandidates[index][field] = value;
    setForm({ ...form, [postType]: updatedCandidates });
  };

  const addCandidate = (postType) => {
    const newCandidate = { name: '', candidateId: '', party: '' };
    setForm({ ...form, [postType]: [...form[postType], newCandidate] });
  };

  const removeCandidate = (postType, index) => {
    const updatedCandidates = [...form[postType]];
    updatedCandidates.splice(index, 1);
    setForm({ ...form, [postType]: updatedCandidates });
  };

  const validateCandidates = () => {
    const mayorParties = new Set();
    for (const candidate of form.mayorCandidates) {
      if (candidate.party && mayorParties.has(candidate.party)) {
        toast.error(`${candidate.party} can't have more than one mayor candidate`);
        return false;
      }
      if (candidate.party) {
        mayorParties.add(candidate.party);
      }
    }

    const deputyMayorParties = new Set();
    for (const candidate of form.deputyMayorCandidates) {
      if (candidate.party && deputyMayorParties.has(candidate.party)) {
        toast.error(`${candidate.party} can't have more than one deputy mayor candidate.`);
        return false;
      }
      if (candidate.party) {
        deputyMayorParties.add(candidate.party);
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCandidates()) return;

    try {
      // Fetch elections data
      const electionResponse = await fetch('/api/elections');
      if (!electionResponse.ok) {
        toast.error('Failed to fetch election data');
        return;
      }

      const data = await electionResponse.json();
      console.log('Fetched Elections Data:', data);  // Log data to debug

      const elections = data.elections || [];

      if (!Array.isArray(elections)) {
        toast.error('Election data is invalid.');
        return;
      }

      const sanitizedElectionId = form.electionId.trim();

      // Check if the election ID exists in the elections data
      const electionExists = elections.some(
        (election) => election.electionId.trim() === sanitizedElectionId
      );

      if (!electionExists) {
        toast.error('Election ID does not exist.');
        return;
      }

      // Proceed to create the candidate
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success('Candidates created!');
        router.push('/candidates');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create candidates.');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the form.');
      console.error(error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const isAdmin = session?.user?.admin;

  if (!isAdmin) {
    return <div>Not an admin</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Create New Candidates
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 py-10 space-y-6">
        {/* Election ID Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Election ID</label>
          <input
            type="text"
            value={form.electionId}
            onChange={(e) => setForm({ ...form, electionId: e.target.value })}
            placeholder="Enter Election ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* District Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">District</label>
          <select
            value={form.district}
            onChange={(e) =>
              setForm({
                ...form,
                district: e.target.value,
                municipality: '',
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select District</option>
            {Object.keys(districtMunicipalities).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Municipality</label>
          <select
            value={form.municipality}
            onChange={(e) => setForm({ ...form, municipality: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Municipality</option>
            {districtMunicipalities[form.district]?.map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </div>

        {/* Candidates Section */}
        {['mayorCandidates', 'deputyMayorCandidates'].map((postType) => (
          <div key={postType}>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {postType === 'mayorCandidates' ? 'Mayor Candidates' : 'Deputy Mayor Candidates'}
            </h2>
            {form[postType].map((candidate, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleInputChange(postType, index, 'name', e.target.value)}
                    placeholder="Enter candidate's name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Candidate ID
                  </label>
                  <input
                    type="text"
                    value={candidate.candidateId}
                    onChange={(e) => handleInputChange(postType, index, 'candidateId', e.target.value)}
                    placeholder="Enter candidate's ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Party</label>
                  <select
                    value={candidate.party}
                    onChange={(e) => handleInputChange(postType, index, 'party', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Party</option>
                    <option value="Party A">Party A</option>
                    <option value="Party B">Party B</option>
                    <option value="Party C">Party C</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeCandidate(postType, index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove Candidate
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addCandidate(postType)}
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
            >
              Add Another {postType === 'mayorCandidates' ? 'Mayor' : 'Deputy Mayor'} Candidate
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
