########################################################################
#
# Functions for downloading the COCO data-set from the internet
# and loading it into memory. This data-set contains images and
# various associated data such as text-captions describing the images.
#
# http://cocodataset.org
#
# Implemented in Python 3.6
#
# Usage:
# 1) Call set_data_dir() to set the desired storage directory.
# 2) Call maybe_download_and_extract() to download the data-set
#    if it is not already located in the given data_dir.
# 3) Call load_records(train=True) and load_records(train=False)
#    to load the data-records for the training- and validation sets.
# 5) Use the returned data in your own program.
#
# Format:
# The COCO data-set contains a large number of images and various
# data for each image stored in a JSON-file.
# Functionality is provided for getting a list of image-filenames
# (but not actually loading the images) along with their associated
# data such as text-captions describing the contents of the images.
#
########################################################################
#
# This file is part of the TensorFlow Tutorials available at:
#
# https://github.com/Hvass-Labs/TensorFlow-Tutorials
#
# Published under the MIT License. See the file LICENSE for details.
#
# Copyright 2018 by Magnus Erik Hvass Pedersen
#
########################################################################

import json
import os
import download
from cache import cache

########################################################################

# Directory where you want to download and save the data-set.
# Set this before you start calling any of the functions below.
# Use the function set_data_dir() to also update train_dir and val_dir.
data_dir = "data/reddit/"

# Sub-directories for the training- and validation-sets.
train_dir = "data/reddit/dataset"
#val_dir = "data/coco/val2017"

# Base-URL for the data-sets on the internet.
#data_url = "http://images.cocodataset.org/"


########################################################################
# Private helper-functions.

def _load_records(train=True):
    """
    Load the image-filenames and captions
    for either the training-set or the validation-set.
    """

    if train:
        # Training-set.
        filename = "annotations.txt"
    else:
        # Validation-set.
        filename = "annotations.txt"

    # Full path for the data-file.
    path = os.path.join(data_dir, "reddit_text", filename)

    #token = 'Flickr8k_text/Flickr8k.token.txt'
    captions = open(path, 'r').read().strip().split('\n')

    # Load the flickr file
    caption_l = []
    cap_5 = []
    filenames = []
    count = 0
    for i in range(len(captions)):
        cap = captions[i].split('\t')[1]
        #cap = re.sub(r'http\S+', '', cap, flags=re.MULTILINE)
        #cap = re.sub(r'u\/\S+', '', cap, flags=re.MULTILINE)
        #cap = re.sub(r'r\/\S+', '', cap, flags=re.MULTILINE)
        count += 1
        if count%5 == 0:
            idx = captions[i].split('\t')[0].split('#')[0]
            filenames.append(idx)   
            caption_l.append(cap_5)
            cap_5 = []
        if 'http' in cap:
            continue
        cap_5.append(cap)


    filenames = tuple(filenames)
    captions_t = tuple(caption_l)

    return filenames, captions_t


########################################################################
# Public functions that you may call to download the data-set from
# the internet and load the data into memory.


def set_data_dir(new_data_dir):
    """
    Set the base-directory for data-files and then
    set the sub-dirs for training and validation data.
    """

    # Ensure we update the global variables.
    #global data_dir, train_dir, val_dir
    global data_dir, train_dir

    data_dir = new_data_dir
    train_dir = os.path.join(new_data_dir, "dataset")
    #val_dir = os.path.join(new_data_dir, "val2017")

def load_records(train=True):
    """
    Load the data-records for the data-set. This returns the image ids,
    filenames and text-captions for either the training-set or validation-set.

    This wraps _load_records() above with a cache, so if the cache-file already
    exists then it is loaded instead of processing the original data-file.

    :param train:
        Bool whether to load the training-set (True) or validation-set (False).

    :return:
        ids, filenames, captions for the images in the data-set.
    """

    if train:
        # Cache-file for the training-set data.
        cache_filename = "records_train_reddit.pkl"
    else:
        # Cache-file for the validation-set data.
        cache_filename = "records_val_reddit.pkl"

    # Path for the cache-file.
    cache_path = os.path.join(data_dir, cache_filename)

    # If the data-records already exist in a cache-file then load it,
    # otherwise call the _load_records() function and save its
    # return-values to the cache-file so it can be loaded the next time.
    records = cache(cache_path=cache_path,
                    fn=_load_records,
                    train=train)

    return records

########################################################################
