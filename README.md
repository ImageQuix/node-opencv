# node-opencv

Modified node-opencv to support static bundling of opencv

## For windows with Visual Studio 2015 build tools:

Download 2.4.13 version of opencv with vc14:
https://github.com/opencv/opencv/releases/download/2.4.13.2/opencv-2.4.13.2-vc14.exe

Install/extract to some dir, e.g., `C:\OpenCV`
Set `OPENCV_DIR` environment variable to that path plus `\build\x64\vc14`, e.g., `C:\OpenCV\build\x64\vc14`

Now, whenever node-opencv is built, opencv will be bundled in it.

## For OSX

Download OpenCV source code:
https://github.com/opencv/opencv/archive/2.4.13.2.zip

Extract to any dir, e.g., `~/Downloads/opencv-2.4.13`

`cd` to that dir

run:

```
mkdir macbuild && cd macbuild
```

With `cmake` installed (can install via brew), run:

```
cmake .. -DBUILD_SHARED_LIBS=OFF -DCMAKE_C_FLAGS_RELEASE=-DNDEBUG -DCMAKE_CXX_FLAGS_RELEASE=-DNDEBUG -DCMAKE_INSTALL_PREFIX="./install" -DCMAKE_BUILD_TYPE=Release -DCMAKE_FIND_FRAMEWORK=LAST -DCMAKE_VERBOSE_MAKEFILE=ON -Wno-dev -DHAVE_CLOCK_GETTIME:INTERNAL=0 -DCMAKE_OSX_DEPLOYMENT_TARGET= -DWITH_TBB=OFF -DWITH_FFMPEG=OFF -DWITH_QUICKTIME=OFF -DWITH_1394=OFF -DWITH_OPENGL=OFF -DWITH_JASPER=OFF -DWITH_GSTREAMER=OFF -DWITH_XIMEA=OFF -DWITH_VTK=OFF -DWITH_CUDA=OFF -DENABLE_SSSE3=ON -DENABLE_SSE41=ON -DENABLE_SSE42=ON -DENABLE_AVX=ON
```

Now `make`, which could take ~10 minutes:

```
make -j4
```

Now `make install`:

```
make install
```

Now, take note of current dir, e.g., `/Users/user/Downloads/opencv-2.4.13/macbuild`

```
pwd
```

Now, set `OPENCV_DIR` environment variable to that path plus `/install`, e.g., `/Users/user/Downloads/opencv-2.4.13/macbuild/install`

Whenever node-opencv is built, opencv will be bundled in it.
