import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const CLOUDINARY_UPLOAD_PRESET = 'gdcrhrz4';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/josla/upload';


class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  render() {
    return (
      <div className='profile'>
        <div className='profileInfo' >
          <p><span className='glyphicon glyphicon-user'></span><b> {this.props.name}</b></p>
          <p><span className='glyphicon glyphicon-bold'></span><b> {this.props.bvn}</b></p>
          <p><span className='glyphicon glyphicon-stats'></span><b> {this.props.account}</b></p>
        </div>
      </div>
    );
  }
}

export default Profile;
