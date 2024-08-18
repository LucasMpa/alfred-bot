from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

def search(playlist):
    chrome_options = Options()
    chrome_service = Service(ChromeDriverManager().install())
    browser = webdriver.Chrome(service=chrome_service, options=chrome_options)

    playlist_links = []
    for song in playlist:
        try:
            browser.get("https://www.youtube.com")
            search_box = browser.find_element(By.NAME, "search_query")
            search_box.send_keys(song)
            search_box.submit()
            
            time.sleep(3)
            
            links_found = browser.find_element(By.XPATH, '//*[@id="video-title"]')
            video_url = links_found.get_attribute("href")
            title = links_found.get_attribute("title")
            
            playlist_links.append({'title': title, 'url': video_url})
        except Exception as e:
            print(e)
            return None
    browser.quit()

    return playlist_links
    


