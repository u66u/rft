# Requires "requests" to be installed (see python-requests.org)
import requests
import os

# Create output directory if it doesn't exist
os.makedirs('jcti/questions/nobg', exist_ok=True)



# Process answer images 1-52
for i in range(3, 53):
    input_path = f'jcti/answers/{i}-2.png'
    output_path = f'jcti/answers/nobg/{i}-2.png'
    
    print(f'Processing answer image {i}/52...')
    
    try:
        response = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            files={'image_file': open(input_path, 'rb')},
            data={'size': 'auto'},
            headers={'X-Api-Key': 'ub91suQfVaN5xQpt9VrZ71vC'},
        )
        
        if response.status_code == requests.codes.ok:
            with open(output_path, 'wb') as out:
                out.write(response.content)
            print(f'Successfully processed answer image {i}')
        else:
            print(f"Error processing answer image {i}:", response.status_code, response.text)
            
    except Exception as e:
        print(f"Error processing answer image {i}:", str(e))