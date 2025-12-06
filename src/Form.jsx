import { useEffect } from 'react';
import Button from './Button';
import createAxiosInstance from './axiosInstance';

function useDebounce(value, delay = 500){
  let response;
  console.log(`debounce hook triggered, value: ${value}, response: ${response}`);
  
  async function fetchCategory() {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`https://www.watchmendailyjournal.com/wp-json/wp/v2/categories?slug=${value}&_fields=id,name,slug`)
      console.log("response:", response);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  }

  // fetchCategory();
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCategory();
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return response;
}

function Form(props){
  console.log(`form rendered, category: ${props.category}`);
  const categories = useDebounce(props.category, 2000); 
  console.log("debounced categories:", categories);

  return(
    <>
      <form
        className="flex flex-col justify-self-center gap-2 mt-8 mb-8 max-w-fit p-6 rounded-lg shadow-sm" 
        onSubmit={props.onSubmit}>
        <div>
          <label htmlFor="url"><strong>WordPress Site URL: </strong></label>
          <input className="input" type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={props.url} required onChange={e => {
            let input = e.target;
            if (!input.value.startsWith("http://") && !input.value.startsWith("https://")) {
              input.value = "https://" + input.value;
            }
            props.setUrl(input.value)
          }} />
        </div>

        <div>
          <label htmlFor="category"><strong>Category Id: </strong></label>
          <input className="input" type="text" id= "category" name="category" value={props.category} onChange={(e) => props.setCategory(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="date"><strong>Date published: </strong></label>
          <input className="input" type="date" id= "date" name="date"  value={props.date} onChange={e => props.setDate(e.target.value)}/>
        </div>
        <Button btnText={"Submit"} type="submit" />
      </form>
    </>
  )
}

export default Form;