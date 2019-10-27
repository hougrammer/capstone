# W210 Capstone

David Hou, Kenneth Chen, Nishi Wadhera

# Directory setup

After `git checkout -b flaskdev`, you still need to download some pre-trained files in order to launch the flask. 

```
README.md
website
  |- website.py
  |- app
      |- data
          |- subreddit_embeddings.pickle (64MB: https://drive.google.com/open?id=1_vvs-1TvXPTyg2wG7oGEqzV4Y-pAnNDq)
  |- preloaded_files
      |- captions_train_flat_reddit.pkl
      |- captions_train_flat_coco.pkl (42.9MB : https://drive.google.com/file/d/1AoQucAasSAklaK8jmChwzA5ziWY9_I_C/view?usp=sharing)
      |- decoder_model_reddit.h5 (44.3MB : https://drive.google.com/file/d/1upYHkIgTOtlVyBVV6TbBJ0qJxeuywGfV/view?usp=sharing)
      |- decoder_model_coco.h5 (50.6MB : https://drive.google.com/file/d/1pNW6PpELqzHlCqalwsK3m68aYi8VAu6w/view?usp=sharing)
      |- model_transferred.h5 (537.1MB : https://drive.google.com/file/d/1baJjN_Tz1O1rB8phK356AbNze6ns0x8p/view?usp=sharing)
      
```


