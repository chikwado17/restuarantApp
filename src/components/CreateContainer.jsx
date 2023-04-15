import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import { MdFastfood, MdCloudUpload, MdDelete, MdFoodBank, MdAttachMoney } from 'react-icons/md'
import Loader from './Loader';
import { doc, setDoc } from 'firebase/firestore';
// import { useStateValue } from '../context/StateContext';
import { categories } from '../utils/Categories';



const CreateContainer = () => {

  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [alertStatus, setAlertStatus] = useState('danger');
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const [shortUrl, setShortUrl] = useState(null);

 
  // const {fetchFoodItems} = useStateValue();

  

  //function to upload image to storage in firebase
  const uploadImage = (e) => {

    setIsLoading(true);

    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);


    uploadTask.on('state_changed', (snapshot) => {

      // const uploadProgress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

 

    }, (error) => {

      console.log(error);
      setFields(true);
      setMsg('Error while uploading: Try Again! ');
      setAlertStatus('danger');

      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      },4000)

    }, () => {

      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {


        
        setImageAsset(downloadURL);

        //shortenURL function
        shortenUrl(downloadURL, (shortenedUrl) => {
          setShortUrl(shortenedUrl);
        })

        setIsLoading(false);
        setFields(true);
        setMsg('Image uploaded successfully');
        setAlertStatus('success');

        setTimeout(() => {
          setFields(false);
        }, 4000);
      });
    });

  }



//shortenURL function
  const shortenUrl = (longUrl, onSuccess, onFailure) => {
    const apiKey = 'e950e26c29944316875b0396982c45b7a8f307b8';
    const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';

    // Set up the request body
    const requestBody = {
      long_url: longUrl
    };

    // Set up the request headers
    const requestHeaders = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Make the API request using fetch
    fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    }).then((data) => {
      // Extract the shortened URL from the API response
      const shortenedUrl = data.link;
      onSuccess(shortenedUrl);
    }).catch((error) => {
      onFailure(error);
    });
  };




  //react firebase function to delete image from storage
  const deleteImage = (image) => {
    
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setImageAsset(null)
      setIsLoading(false);
      setFields(true);
        setMsg('Image deleted successfully');
        setAlertStatus('success');

        setTimeout(() => {
          setFields(false);
        }, 4000);
    })
    
  }

 

    //function to save input data to firestore in reactjs
    const saveDetails = async () => {
      setIsLoading(true);
      try{

        if(!title || !calories || !imageAsset || !price || !category) {
          setFields(true);
          setMsg("Required fields can't be empty!");
          setAlertStatus('danger');
  
          setTimeout(() => {
            setFields(false);
            setIsLoading(false);
          },4000)
        }else {

            const data = {
                id: `${Date.now()}`,
                title: title,
                // imageURL: imageAsset,
                shorten:shortUrl,
                category: category,
                calories: calories,
                // qty:1,
                price:parseInt(price)
            }

            //save to database
            await setDoc(doc(db, 'foodItems', `${Date.now()}`), data, {merge:true})

            setFields(true);
            setMsg('Item uploaded successfully');
            setTitle("");
            setImageAsset(null);
            setCalories("");
            setCategory(null);
            setPrice("");
            setAlertStatus('success');
    
            setTimeout(() => {
              setFields(false);
              setIsLoading(false);
            }, 4000);

            // fetchFoodItems();
        }



      }catch(error) {

        console.log(error);
        setFields(true);
        setMsg('Error while uploading: Try Again! ');
        setAlertStatus('danger');

        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        },4000)
      }

    }






  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <div className='w-[90%] md:w-[75%] border border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center gap-4'>
        {fields && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
                alertStatus === "danger"
                  ? "bg-red-400 text-red-800"
                  : "bg-emerald-400 text-emerald-800"
              }`}
            >
              {msg}
            </motion.p>
          )}


         <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                <MdFastfood className='text-xl text-gray-700'/>
                <input onChange={(e) => setTitle(e.target.value)} className='w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor' type="text" required value={title} placeholder="Give me a title..." />
         </div>

         

         <div className='w-full'>
                <select className='outline-none w-full text-base border-b-2 bg-white border-gray-200 p-2 rounded-md cursor-pointer' onChange={(e) => setCategory(e.target.value)} name="" id="">
                  <option className='bg-white' value="other" >Select Category</option>
                
                  {categories && categories.map(item => (
                    <option className='text-base border-0 outline-none capitalize bg-white text-headingColor' key={item.id} value={item.urlParamName}>{item.name}</option>
                  ))}
                </select>
         </div>

         <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {!imageAsset ? (
                <>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                      <p className="text-gray-500 hover:text-gray-700">
                        Click here to upload
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadimage"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative h-full">
                    <img
                      src={imageAsset}
                      alt="uploadedimage"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                      onClick={deleteImage}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>


         <div className="w-full flex flex-col md:flex-row items-center gap-3">

              <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                   <MdFoodBank className='text-gray-700 text-2xl' /> 
                   <input type="text" required placeholder='Calories' value={calories} onChange={(e) => setCalories(e.target.value)} className='w-full h-full text-lg text-textColor bg-transparent outline-none border-none placeholder:text-gray-400' />
              </div>

              <div className='w-full py-2 border-b border-gray-300 flex items-center gap-2'>
                   <MdAttachMoney className='text-gray-700 text-2xl' /> 
                   <input type="text" required placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} className='w-full h-full text-lg text-textColor bg-transparent outline-none border-none placeholder:text-gray-400' />
              </div>


         </div>

         <div className="flex items-center w-full">
          <button onClick={saveDetails} type='button' className='ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold'>Save</button>
         </div>
      </div>
    </div>
  )
}

export default CreateContainer